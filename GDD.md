# GDD.md — Game Design Document
# AETHERIA: RESONANCE OF THE WEAVE

---

## 1. Visión General & Identidad de Producto

* **Título:** *Aetheria: Resonance of the Weave*
* **Género:** JRPG Cinemático de Fantasía Tecno-Mágica / Acción Táctica Híbrida
* **Público Objetivo:** Jugadores apasionados de JRPGs de alto presupuesto narrativo y estratégico (*Final Fantasy VII Remake/Rebirth*, *Xenoblade Chronicles*, *Tales of Arise*, *Clair Obscur: Expedition 33*), que buscan mundos inmersivos, dilemas morales sociopolíticos y combate táctico profundo.
* **Tono y Atmósfera:** Épico, dramático, *Neoclassical Diesel-Arcana*, reflexivo sobre el costo del progreso tecnológico y la alienación ecológica.
* **Plataformas:** PC / Consolas de última generación / Slice vertical ejecutable en navegador (WebGL / Three.js / Web Audio API).

---

## 2. Universo, Mitología y Conflicto Narrativo

### 2.1 El Mundo: Tellus-Lux y "El Tejido de la Cuerda" (*The String Weave*)
En *Tellus-Lux*, el universo no se sostiene sobre magia elemental básica ni sobre corrientes espirituales animistas de almas difuntas. Toda materia, pensamiento, organismo y recuerdo físico vibra en una longitud de onda particular del **Harmónico Primordial**. El entramado cuántico-espiritual que cohesiona la realidad se denomina **El Tejido** (*The Weave*).
* Cuando un bioma está sano, emite un *Acorde Pleno* que sustenta la atmósfera, la gravedad y la regeneración celular.
* Cuando una frecuencia es alterada o colapsada violentamente, la materia pierde masa y coherencia, desintegrándose en estática y silencio.

### 2.2 Facciones en Conflicto
1. **La Hegemonía de Baritonia (Poder Imperial Autocrático):**
   * Pioneros de la tecnología de los **Tuning Engines (Motores de Disipación)**.
   * Estos colosales reactores de bronce y vacío extraen las frecuencias armónicas naturales de los continentes para energizar megalópolis flotantes y autómatas de asedio.
   * Consecuencia colateral: La creación de las **Zonas Mudas** (*Mute Wastes*), extensiones desaturadas donde el sonido físico se apaga y los habitantes sufren *Desincronización Celular* (pérdida progresiva de recuerdos e identidad antes de la disolución física).
2. **El Enclave de los Acordes Libres (Resistencia y Ciudades Confederadas):**
   * Agrupación de artesanos, geocronistas y bardos marciales que buscan restaurar la sintonía del planeta mediante resonadores orgánicos.
3. **La Herejía de los Silentes (Culto Nihilista Antagónico):**
   * Fanáticos que sostienen que la existencia es un error cacofónico y doloroso. Buscan detonar los Motores de Disipación en el punto cero del planeta para provocar la "Pausa Eterna".

### 2.3 Amenaza Cósmica: Las Entidades del Anti-Tono (*Discordantes*)
Al crearse vacíos acústicos y zonas de frecuencia cero, emergen desde el no-espacio las **Entidades del Anti-Tono**. Criaturas geométricas fractales que consumen vibraciones vivas, distorsionando el tiempo y desintegrando la realidad física a su paso.

---

## 3. Personajes Principales (The Party)

```text
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│       KAELEN VOSS       │    │     LYRA BEL-TESH       │    │   UNIDAD V-08 (ORIN)    │
│  Ex-Afinador Imperial   │    │  Geocronista & Erudita  │    │   Autómata Emancipado   │
│ Rol: Espadachín Táctico │    │ Rol: Soporte & Prisma   │    │ Rol: Tanque Sísmico     │
│ Arma: Espada-Diapasón   │    │ Arma: Astrolabio Reson. │    │ Arma: Puños Neumáticos  │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

1. **Kaelen Voss:**
   * *Origen:* Antiguo oficial y afinador acústico militar de la Hegemonía de Baritonia.
   * *Conflicto:* Calibró el primer reactor que colapsó su propio distrito de origen. Lleva un audífono mecánico que amortigua el constante chillido de disonancia del planeta.
   * *Rol Mecánico:* Daño físico cortante a corta distancia, acumulación rápida de resonancia y ejecución de quiebres defensivos (*Pitch Breakdown*).
2. **Lyra Bel-Tesh:**
   * *Origen:* Curadora de la Gran Fonoteca del Enclave.
   * *Conflicto:* Ve cómo los registros sonoros de pueblos ancestrales se desvanecen en las Zonas Mudas; está dispuesta a desafiar prohibiciones académicas para salvar la historia.
   * *Rol Mecánico:* Proyección de armónicos refractados a media/larga distancia, escudos de resonancia armónica y amplificación de daño de acordes.
3. **Unidad V-08 (Orin Vane):**
   * *Origen:* Gólem industrial de extracción minera en los bastiones baritonios.
   * *Conflicto:* Un colapso de frecuencias en una mina no lo destruyó, sino que generó una armónica autorreplicante en su cerebro computacional de mercurio y latón, otorgándole libre albedrío.
   * *Rol Mecánico:* Absorción de impactos cinéticos, generación de ondas sísmicas de baja frecuencia y control de multitudes.

---

## 4. Sistema de Combate: Harmonic Active Command (HAC)

El combate combina la inmediatez de la acción tridimensional con la toma de decisiones estratégicas pausadas, respetando el marco de libertad de patentes.

```
       [TIEMPO REAL: Posicionamiento 3D, Esquiva & Golpes Básicos]
                                  │
                                  ▼ (Acumulación de Tensión Armónica)
       [CADENCIA TÁCTICA: Bullet-Time al 15% + Apertura de Dial Radial]
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       [Habilidades de Frecuencia]     [Sinergia de Acordes de Party]
       (Aguda: Rompe Escudo            (Tónica + Dominante =
        Grave: Aturdimiento Sísmico)    Onda Estacionaria Crítica)
```

### 4.1 Fases del Combate
1. **Acción Fluida en Tiempo Real:**
   * Movimiento libre en 360°, ataques básicos ligeros/pesados, bloqueos rítmicos (*Harmonic Parry*) que devuelven vibraciones cinéticas al agresor.
2. **Barra de Frecuencia y Tensión Armónica:**
   * Cada impacto sincronizado llena el medidor armónico del personaje activo y del grupo.
3. **Cadencia Táctica (*HAC Lens*):**
   * Al pulsar el gatillo de comando táctico, la acción **no se congela al 100%**, sino que entra en una **dilatación temporal fluida (*bullet-time* al 85% de reducción)**.
   * Aparece un menú radial flotante (el *Dial Armónico*) centrado en el personaje activo, permitiendo ordenar habilidades, cambiar de líder al instante o instruir combinaciones a los aliados.
4. **Mecánica de Acordes (Sinfonías de Colaboración):**
   * Cada técnica deja una *Frecuencia Residual* en el enemigo (ej. Tónica, Tercera, Quinta).
   * Al conectar dos ataques con frecuencias consonantes dentro de una ventana de 4 segundos, se detona una **Onda Estacionaria**: daño multiplicativo masivo y dispersión sónica sin interrumpir la fluidez con cinemáticas invasivas.

---

## 5. Progresión: The Node-Matrix (Matriz de Oscilación)

* **Estructura:** Cada miembro del grupo dispone de un resonador cilíndrico con ranuras helicoidales conectadas por filamentos de latón y mercurio.
* **Vectores de Tono:** Cristales tallados que almacenan firmas acústicas obtenidas de la flora, la fauna y los Discordantes derrotados.
  * *Vectores de Impulso (Cinéticos):* Aumentan la penetración física y la velocidad de ataque.
  * *Vectores de Tono Alto (Armónicos):* Otorgan técnicas a distancia de combustión de cuerda y escudos etéreos.
  * *Vectores de Resonancia Baja (Sísmicos):* Proporcionan resistencia al retroceso, aumento de masa y aturdimiento.
* **Resonancia de Ranuras Adyacentes:** Si dos ranuras contiguas albergan vectores de la misma familia tímbrica, se desbloquea una habilidad híbrida pasiva exclusiva (ej. *Absorción Reversible*, *Filo de Resonancia Sonora*).

---

## 6. Bucle de Exploración y Modo Afinación

1. **Exploración de Biomas:** Tránsito entre metrópolis de bronce, bosques resonantes y Zonas Mudas en blanco y negro.
2. **Modo Afinación (*Attunement Scan*):**
   * El jugador pulsa el analizador sonoro: el mundo visual adopta un filtro cian-dorado donde se hacen visibles las cuerdas del Tejido.
   * Puzzles ambientales: Reequilibrar diapasores ancestrales para hacer emerger puentes de energía armónica, desactivar barreras de disipación y revelar cofres de Vectores Antiguos.
3. **Restauración Ambiental:** Desactivar los motores de la Hegemonía restaura el color y la vida en las Zonas Mudas, repoblando asentamientos y abriendo rutas comerciales.

---

## 7. Economía y Recursos

* **Moneda Oficial:** **Talentos de Latón (*Brass Pounds*)** y **Ecos Puros (*Pure Echoes*)**.
* **Materiales de Artesanía:** Barras de cobre estriado, mercurio sellado, filamentos armónicos y núcleos de resonancia discordante.
* **Transporte / Monturas:** **Velo-Striders**, ágiles bípedos de cresta sónica bífida y plumas bioluminiscentes que se desplazan planeando sobre ondas térmicas terrestres.
