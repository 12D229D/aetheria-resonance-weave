/**
 * src/combat/resonanceChords.js
 * Lógica matemática de resolución de frecuencias y detección de Ondas Estacionarias.
 */

export const FrequencyTiers = {
  TONIC: 'Tónica (Raíz)',
  THIRD: 'Tercera Mayor',
  FIFTH: 'Quinta Justa',
  OCTAVE: 'Sinfonía (8ª)'
};

export class ResonanceChords {
  constructor() {
    this.activeSequence = [];
    this.sequenceTimeout = null;
  }

  /**
   * Registra una frecuencia emitida por una acción y comprueba si detona un acorde.
   * @param {string} characterId 
   * @param {string} frequencyType 
   * @returns {Object|null} Información del acorde detonado o null
   */
  registerFrequency(characterId, frequencyType) {
    clearTimeout(this.sequenceTimeout);

    this.activeSequence.push({ characterId, frequencyType, timestamp: Date.now() });

    // Mantener solo los últimos 3 impactos armónicos en la ventana temporal
    if (this.activeSequence.length > 3) {
      this.activeSequence.shift();
    }

    // Comprobar combinaciones de Onda Estacionaria
    const result = this.evaluateChord();

    // Resetear secuencia tras 4.5 segundos de inactividad
    this.sequenceTimeout = setTimeout(() => {
      this.activeSequence = [];
    }, 4500);

    return result;
  }

  evaluateChord() {
    if (this.activeSequence.length < 2) return null;

    const last = this.activeSequence[this.activeSequence.length - 1];
    const prev = this.activeSequence[this.activeSequence.length - 2];

    // Condición 1: Deben ser dos personajes distintos para formar sinfonía de party
    if (last.characterId === prev.characterId) return null;

    // Condición 2: Frecuencias consonantes (Aguda + Grave, o Tónica + Quinta)
    const f1 = last.frequencyType;
    const f2 = prev.frequencyType;

    const isConsonant =
      (f1.includes('Aguda') && f2.includes('Grave')) ||
      (f1.includes('Grave') && f2.includes('Aguda')) ||
      (f1.includes('Tónica') && f2.includes('Quinta')) ||
      (f1.includes('Sinfonía'));

    if (isConsonant) {
      const chordName = f1.includes('Sinfonía')
        ? 'ONDA ESTACIONARIA: SINFONÍA PLENA'
        : 'ONDA ESTACIONARIA: CADENCIA DE RESONANCIA';

      const damageMultiplier = f1.includes('Sinfonía') ? 3.5 : 2.2;
      const staggerBonus = 35;

      // Consumir la combinación
      this.activeSequence = [];

      return {
        chordName,
        damageMultiplier,
        staggerBonus,
        initiators: [prev.characterId, last.characterId]
      };
    }

    return null;
  }
}

export const resonanceChords = new ResonanceChords();
