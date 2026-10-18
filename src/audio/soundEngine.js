/**
 * src/audio/soundEngine.js
 * Motor Web Audio API de síntesis procedimental para Aetheria: Resonance of the Weave.
 * Diseñado con politonalidad, acordes sinfónicos resolutivos originales y efectos sónicos cinéticos.
 * 100% libre de samples comerciales protegidos.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.isMuted = false;
    this.droneOscillators = [];
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    this.startAmbientWeaveDrone();
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Drone ambiental continuo que representa "El Tejido" (The String Weave).
   * Modula frecuencias sutiles en modo lidio (Re, Sol#, La, Do#).
   */
  startAmbientWeaveDrone() {
    if (!this.ctx) return;
    const baseFreqs = [146.83, 220.00, 277.18, 415.30]; // D3, A3, C#4, G#4
    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.ambientGain);

      osc.start();
      this.droneOscillators.push({ osc, gain });
    });
  }

  /**
   * Efecto de golpe cinético básico de la espada diapasón o puño neumático.
   */
  playAttackHit(type = 'sharp') {
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const t = this.ctx.currentTime;
    if (type === 'sharp') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(580, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(350, t);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.22);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, t);
    }

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (type === 'sharp' ? 0.15 : 0.25));

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + (type === 'sharp' ? 0.16 : 0.26));
  }

  /**
   * Dilatación temporal al desplegar el Dial Armónico HAC (filtro de paso bajo y campana de vacío).
   */
  playTacticalCadenceEnter() {
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.35);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.42);
  }

  /**
   * Detonación de Onda Estacionaria (Acorde armónico de alta potencia)
   * Sintetiza una tríada mayor con séptima y armónicos superiores brillantes.
   */
  playStandingWaveChord() {
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Acorde Mi Mayor con 9ª: Mi, Sol#, Si, Re#, Fa#
    const freqs = [329.63, 415.30, 493.88, 622.25, 739.99];

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);

      // Ligero vibrato en los sobretonos
      if (idx > 2) {
        osc.frequency.linearRampToValueAtTime(f * 1.01, t + 0.8);
      }

      gain.gain.setValueAtTime(0.3 / (idx + 1), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 1.7);
    });
  }

  /**
   * Acorde de Purificación / Resolución de Zona Muda
   */
  playPurificationChime() {
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // Do Mayor brillante

    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + i * 0.08);

      gain.gain.setValueAtTime(0.25, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + i * 0.08);
      osc.stop(t + 2.3);
    });
  }
}

export const soundEngine = new SoundEngine();
