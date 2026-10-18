/**
 * src/core/state.js
 * Máquina de estado global para Aetheria: Resonance of the Weave
 */

export const GameModes = {
  EXPLORATION: 'EXPLORATION',
  COMBAT: 'COMBAT',
  TACTICAL_CADENCE: 'TACTICAL_CADENCE',
  ATTUNEMENT_SCAN: 'ATTUNEMENT_SCAN',
  MATRIX_MENU: 'MATRIX_MENU'
};

export class GameState {
  constructor() {
    this.currentMode = GameModes.COMBAT;
    this.timeScale = 1.0; // 1.0 = tiempo real, 0.15 = bullet-time durante Cadencia Táctica
    this.isMuteWaste = true; // Zona Muda activa con desaturación visual y acústica
    this.purifiedPercentage = 20;

    // Recursos de la partida
    this.currencies = {
      brassPounds: 520,
      pureEchoes: 14
    };

    // Miembros de la party
    this.party = [
      {
        id: 'kaelen',
        name: 'Kaelen Voss',
        role: 'Afinador Táctico',
        hp: 1850,
        maxHp: 2100,
        tension: 65, // %
        maxTension: 100,
        activeFrequency: 'Tónica (Raíz)',
        color: '#d4af37',
        meshColor: 0xd4af37,
        actions: [
          { id: 'blade_resonance', name: 'Tajo Diapasón', freq: 'Aguda (3ª)', cost: 25, power: 180, type: 'Corte' },
          { id: 'harmonic_break', name: 'Quiebre de Tono', freq: 'Grave (5ª)', cost: 40, power: 310, type: 'Aturdimiento' },
          { id: 'pyre_crescendo', name: 'Pyre-Crescendo', freq: 'Sinfonía (8ª)', cost: 70, power: 580, type: 'Fuego Tonal' }
        ]
      },
      {
        id: 'lyra',
        name: 'Lyra Bel-Tesh',
        role: 'Geocronista',
        hp: 1350,
        maxHp: 1550,
        tension: 40,
        maxTension: 100,
        activeFrequency: 'Tercera Mayor',
        color: '#38bdf8',
        meshColor: 0x38bdf8,
        actions: [
          { id: 'prism_ray', name: 'Prisma Armónico', freq: 'Aguda (3ª)', cost: 20, power: 140, type: 'Luz' },
          { id: 'echo_barrier', name: 'Barrera de Resonancia', freq: 'Media (Tónica)', cost: 35, power: 250, type: 'Escudo' },
          { id: 'hymn_restoration', name: 'Himno de Restauración', freq: 'Sinfonía (8ª)', cost: 60, power: 450, type: 'Curación' }
        ]
      },
      {
        id: 'unit_v08',
        name: 'Unidad V-08',
        role: 'Autómata Sísmico',
        hp: 3100,
        maxHp: 3100,
        tension: 20,
        maxTension: 100,
        activeFrequency: 'Quinta Justa',
        color: '#a855f7',
        meshColor: 0xa855f7,
        actions: [
          { id: 'seismic_slam', name: 'Golpe Neumático', freq: 'Grave (5ª)', cost: 30, power: 220, type: 'Impacto' },
          { id: 'kinetic_dispersion', name: 'Dispersión Cinética', freq: 'Media (Tónica)', cost: 45, power: 340, type: 'Atracción' },
          { id: 'sub_bass_quake', name: 'Terremoto Sub-Grave', freq: 'Grave (5ª)', cost: 65, power: 520, type: 'Sísmico' }
        ]
      }
    ];

    this.activeLeaderIndex = 0;

    // Enemigo actual (Entidad Discordante del Anti-Tono)
    this.targetEnemy = {
      name: 'Discordante Resonador Alfa',
      subtitle: 'Entidad de Ruptura de Frecuencia Cero',
      hp: 14200,
      maxHp: 18000,
      stagger: 45, // % de desestabilización armónica
      maxStagger: 100,
      activeFrequencies: ['Inestabilidad Aguda', 'Vacío de Tono'],
      lastAppliedFrequency: null
    };

    // Ranuras de la Matriz de Oscilación
    this.nodeMatrix = [
      { id: 'slot_1', name: 'Ranura Helicoidal I', vector: 'Vector de Impulso Cinético (+15% Vel)', family: 'Cinético' },
      { id: 'slot_2', name: 'Ranura Helicoidal II', vector: 'Vector Armónico Agudo (+20% Daño de Cuerda)', family: 'Armónico' },
      { id: 'slot_3', name: 'Ranura Helicoidal III', vector: 'Vector Sísmico de Baja Frecuencia (+300 HP)', family: 'Sísmico' },
      { id: 'slot_4', name: 'Ranura de Resonancia IV', vector: 'Vector de Fricción Pura (Detonación Rápida)', family: 'Cinético' },
      { id: 'slot_5', name: 'Ranura de Resonancia V', vector: 'Prisma de Reflexión Sonora (Escudo Pasivo)', family: 'Armónico' },
      { id: 'slot_6', name: 'Ranura Tonal VI', vector: null, family: 'Vacío' }
    ];
  }

  getActiveLeader() {
    return this.party[this.activeLeaderIndex];
  }

  setLeaderIndex(index) {
    if (index >= 0 && index < this.party.length) {
      this.activeLeaderIndex = index;
    }
  }
}

export const gameState = new GameState();
