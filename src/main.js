/**
 * src/main.js
 * Punto de entrada principal y orquestador de Aetheria: Resonance of the Weave.
 * Renderiza el mundo 3D en Three.js, HUD diegético, combate en tiempo real y dial radial.
 */

import { gameState, GameModes } from './core/state.js';
import { eventBus } from './core/eventBus.js';
import { hacEngine } from './combat/hacEngine.js';
import { soundEngine } from './audio/soundEngine.js';
import { sqliteDb } from './storage/sqliteDb.js';

// Variables de Three.js
let scene, camera, renderer;
let enemyMesh, partyMeshes = [];
let weaveParticles;

function initThreeScene() {
  const container = document.getElementById('viewport-canvas');
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x090c10, 0.025);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 4.5, 12);
  camera.lookAt(0, 1.2, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // Iluminación cinemática
  const ambientLight = new THREE.AmbientLight(0x2d3748, 1.2);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xd4af37, 2.0);
  dirLight.position.set(8, 15, 10);
  scene.add(dirLight);

  const rimLight = new THREE.PointLight(0xa855f7, 3.5, 30);
  rimLight.position.set(-6, 4, -4);
  scene.add(rimLight);

  // Terreno de la Zona Muda (Placas hexagonales de latón y basalto)
  const floorGeo = new THREE.CylinderGeometry(18, 18, 0.8, 32);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x141a24,
    roughness: 0.7,
    metalness: 0.6
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.4;
  scene.add(floor);

  // Anillos concéntricos de frecuencia del Tejido
  for (let r = 5; r <= 15; r += 4) {
    const ringGeo = new THREE.RingGeometry(r, r + 0.1, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.02;
    scene.add(ring);
  }

  // Enemigo: Entidad Discordante del Anti-Tono (Icosaedro fractal flotante)
  const enemyGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const enemyMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0x881337,
    roughness: 0.2,
    metalness: 0.85,
    wireframe: false
  });
  enemyMesh = new THREE.Mesh(enemyGeo, enemyMat);
  enemyMesh.position.set(0, 2.4, -2.5);
  scene.add(enemyMesh);

  // Anillo de distorsión del enemigo
  const distRingGeo = new THREE.TorusGeometry(2.3, 0.06, 16, 64);
  const distRingMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.6 });
  const distRing = new THREE.Mesh(distRingGeo, distRingMat);
  distRing.rotation.x = Math.PI / 3;
  enemyMesh.add(distRing);

  // Modelos de la Party (Prismas estilizados de latón y luz)
  const partyPositions = [
    { x: -2.8, z: 2.8 },
    { x: 0, z: 4.2 },
    { x: 2.8, z: 2.8 }
  ];

  gameState.party.forEach((char, idx) => {
    const pGeo = new THREE.ConeGeometry(0.55, 2.0, 5);
    const pMat = new THREE.MeshStandardMaterial({
      color: char.meshColor,
      roughness: 0.3,
      metalness: 0.8
    });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.position.set(partyPositions[idx].x, 1.0, partyPositions[idx].z);
    scene.add(pMesh);
    partyMeshes.push(pMesh);
  });

  // Partículas de "El Tejido" (Filamentos flotantes)
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 26;
    particlePos[i + 1] = Math.random() * 8;
    particlePos[i + 2] = (Math.random() - 0.5) * 26;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xd4af37,
    size: 0.08,
    transparent: true,
    opacity: 0.6
  });
  weaveParticles = new THREE.Points(particleGeo, particleMat);
  scene.add(weaveParticles);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Bucle de renderizado
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta() * gameState.timeScale;
  const time = clock.getElapsedTime();

  if (enemyMesh) {
    enemyMesh.rotation.y += 0.8 * delta;
    enemyMesh.rotation.x += 0.4 * delta;
    enemyMesh.position.y = 2.4 + Math.sin(time * 2) * 0.25;
  }

  if (weaveParticles) {
    weaveParticles.rotation.y += 0.05 * delta;
  }

  // Rotación ligera en la party
  partyMeshes.forEach((mesh, i) => {
    mesh.rotation.y += 0.4 * delta;
    // Resaltar líder
    if (i === gameState.activeLeaderIndex) {
      mesh.scale.set(1.2, 1.2, 1.2);
    } else {
      mesh.scale.set(1.0, 1.0, 1.0);
    }
  });

  renderer.render(scene, camera);
}

// Vinculación de la Interfaz de Usuario (HUD y Dial)
function setupUI() {
  const partyContainer = document.getElementById('party-hud');
  const enemyHpFill = document.getElementById('enemy-hp-fill');
  const enemyHpVal = document.getElementById('enemy-hp-val');
  const enemyStaggerFill = document.getElementById('enemy-stagger-fill');
  const brassVal = document.getElementById('currency-brass');
  const echoesVal = document.getElementById('currency-echoes');

  function renderPartyHUD() {
    partyContainer.innerHTML = '';
    gameState.party.forEach((char, idx) => {
      const isLeader = idx === gameState.activeLeaderIndex;
      const card = document.createElement('div');
      card.className = `party-card ${isLeader ? 'active-leader' : ''}`;
      card.id = `party-card-${char.id}`;
      card.innerHTML = `
        <div class="party-meta">
          <span class="party-name">${char.name}</span>
          <span class="party-role">${char.role}</span>
        </div>
        <div class="stat-bars">
          <div class="bar-wrapper">
            <span>HP</span>
            <div class="bar-track">
              <div class="bar-fill-hp" style="width: ${(char.hp / char.maxHp) * 100}%"></div>
            </div>
            <span>${char.hp}</span>
          </div>
          <div class="bar-wrapper">
            <span>TEN</span>
            <div class="bar-track">
              <div class="bar-fill-tension" style="width: ${(char.tension / char.maxTension) * 100}%"></div>
            </div>
            <span>${Math.floor(char.tension)}%</span>
          </div>
        </div>
      `;
      card.addEventListener('click', () => {
        gameState.setLeaderIndex(idx);
        renderPartyHUD();
        renderDialActions();
      });
      partyContainer.appendChild(card);
    });
  }

  function updateEnemyHUD() {
    const enemy = gameState.targetEnemy;
    const hpPct = (enemy.hp / enemy.maxHp) * 100;
    enemyHpFill.style.width = `${hpPct}%`;
    enemyHpVal.innerText = `${enemy.hp} / ${enemy.maxHp}`;
    enemyStaggerFill.style.width = `${enemy.stagger}%`;

    brassVal.innerText = gameState.currencies.brassPounds;
    echoesVal.innerText = gameState.currencies.pureEchoes;
  }

  function renderDialActions() {
    const leader = gameState.getActiveLeader();
    const dialContainer = document.getElementById('hac-dial-container');
    const nodesContainer = document.getElementById('dial-nodes-layer');
    nodesContainer.innerHTML = '';

    const radius = 175; // px de radio radial
    const total = leader.actions.length;

    leader.actions.forEach((act, i) => {
      const angle = (i * (2 * Math.PI / total)) - (Math.PI / 2);
      const x = 240 + radius * Math.cos(angle);
      const y = 240 + radius * Math.sin(angle);

      const node = document.createElement('div');
      node.className = 'dial-action-node';
      node.id = `action-node-${act.id}`;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.innerHTML = `
        <span class="action-name">${act.name}</span>
        <span class="action-freq">${act.freq}</span>
        <span class="action-cost">Cost: ${act.cost}% TEN</span>
      `;

      node.addEventListener('click', (e) => {
        e.stopPropagation();
        hacEngine.executeDialAction(act);
      });

      nodesContainer.appendChild(node);
    });
  }

  // Eventos de teclado
  window.addEventListener('keydown', (e) => {
    // Espacio: Golpe básico en tiempo real
    if (e.code === 'Space') {
      e.preventDefault();
      hacEngine.executeBasicStrike();
    }
    // Tecla Q o Shift: Cadencia Táctica (Bullet-time + Dial)
    if (e.code === 'KeyQ' || e.code === 'ShiftLeft') {
      e.preventDefault();
      hacEngine.toggleTacticalCadence();
    }
    // Tecla E: Cambiar de líder en la party
    if (e.code === 'KeyE') {
      gameState.setLeaderIndex((gameState.activeLeaderIndex + 1) % gameState.party.length);
      renderPartyHUD();
      renderDialActions();
    }
    // Tecla M: Matriz de Oscilación
    if (e.code === 'KeyM') {
      toggleMatrixModal();
    }
  });

  // Centro del dial para cerrar
  document.getElementById('dial-center-btn').addEventListener('click', () => {
    hacEngine.closeTacticalCadence();
  });

  // Botón táctico en la barra superior
  document.getElementById('btn-tactical-toggle').addEventListener('click', () => {
    hacEngine.toggleTacticalCadence();
  });

  document.getElementById('btn-matrix-toggle').addEventListener('click', () => {
    toggleMatrixModal();
  });

  document.getElementById('btn-purify').addEventListener('click', () => {
    purifyMuteWaste();
  });

  document.getElementById('matrix-close-btn').addEventListener('click', () => {
    toggleMatrixModal(false);
  });

  // Listeners del EventBus
  eventBus.on('tactical:open', () => {
    document.getElementById('hac-dial-container').classList.add('active');
    renderDialActions();
  });

  eventBus.on('tactical:close', () => {
    document.getElementById('hac-dial-container').classList.remove('active');
  });

  eventBus.on('combat:chord', (chord) => {
    showChordBanner(chord.chordName, `Sinergia tonal detonada (+${Math.floor((chord.damageMultiplier - 1) * 100)}% Daño)`);
  });

  eventBus.on('state:updated', () => {
    renderPartyHUD();
    updateEnemyHUD();
  });

  renderPartyHUD();
  updateEnemyHUD();
}

function showChordBanner(title, desc) {
  const banner = document.getElementById('chord-banner');
  document.getElementById('chord-banner-title').innerText = title;
  document.getElementById('chord-banner-desc').innerText = desc;
  banner.classList.add('visible');
  setTimeout(() => {
    banner.classList.remove('visible');
  }, 2200);
}

function toggleMatrixModal(forceState) {
  const modal = document.getElementById('matrix-modal');
  const shouldOpen = forceState !== undefined ? forceState : !modal.classList.contains('active');
  if (shouldOpen) {
    modal.classList.add('active');
    renderMatrixSlots();
  } else {
    modal.classList.remove('active');
  }
}

function renderMatrixSlots() {
  const grid = document.getElementById('matrix-grid-slots');
  grid.innerHTML = '';
  gameState.nodeMatrix.forEach(slot => {
    const card = document.createElement('div');
    card.className = `matrix-slot-card ${slot.vector ? 'equipped' : ''}`;
    card.innerHTML = `
      <div style="font-family: var(--font-title); font-size: 0.9rem; color: var(--brass-accent); font-weight:700;">
        ${slot.name}
      </div>
      <div style="font-size: 0.8rem; color: ${slot.vector ? '#38ef7d' : '#94a3b8'};">
        ${slot.vector || 'Ranura Disponible'}
      </div>
      <div style="font-size: 0.7rem; font-family: var(--font-mono); color: #cbd5e1;">
        Familia: ${slot.family}
      </div>
    `;
    grid.appendChild(card);
  });
}

function purifyMuteWaste() {
  gameState.isMuteWaste = !gameState.isMuteWaste;
  const vignette = document.getElementById('mute-waste-vignette');
  const tag = document.getElementById('region-tag-name');

  if (!gameState.isMuteWaste) {
    vignette.style.opacity = '0.15';
    tag.innerText = 'Cúspide de Latón (Resonancia Armónica Restaurada)';
    soundEngine.playPurificationChime();
    showChordBanner('ZONA ARMÓNICA RESTAURADA', 'El Tejido ha recuperado su frecuencia de vida en esta región.');
  } else {
    vignette.style.opacity = '1.0';
    tag.innerText = 'Cúspide de Latón (Zona Muda Alfa)';
  }
}

// Inicialización general
window.addEventListener('DOMContentLoaded', async () => {
  await sqliteDb.init();
  initThreeScene();
  setupUI();
  animate();
  console.log('Aetheria: Resonance of the Weave iniciado con éxito.');
});
