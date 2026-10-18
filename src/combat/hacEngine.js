/**
 * src/combat/hacEngine.js
 * Motor Harmonic Active Command (HAC): combina acción 3D en tiempo real con
 * dilatación temporal (bullet-time al 85% de desaceleración sin pausa fija) y dial táctico.
 */

import { gameState, GameModes } from '../core/state.js';
import { eventBus } from '../core/eventBus.js';
import { soundEngine } from '../audio/soundEngine.js';
import { resonanceChords } from './resonanceChords.js';

export class HACEngine {
  constructor() {
    this.isTacticalDialOpen = false;
    this.comboCount = 0;
  }

  toggleTacticalCadence() {
    if (gameState.currentMode === GameModes.TACTICAL_CADENCE) {
      this.closeTacticalCadence();
    } else {
      this.openTacticalCadence();
    }
  }

  openTacticalCadence() {
    gameState.currentMode = GameModes.TACTICAL_CADENCE;
    gameState.timeScale = 0.15; // 85% de desaceleración fluida
    this.isTacticalDialOpen = true;

    soundEngine.playTacticalCadenceEnter();
    eventBus.emit('tactical:open', { leader: gameState.getActiveLeader() });
  }

  closeTacticalCadence() {
    gameState.currentMode = GameModes.COMBAT;
    gameState.timeScale = 1.0; // Vuelta al tiempo real
    this.isTacticalDialOpen = false;

    eventBus.emit('tactical:close');
  }

  /**
   * Ejecuta un golpe básico en tiempo real
   */
  executeBasicStrike() {
    const leader = gameState.getActiveLeader();
    const enemy = gameState.targetEnemy;

    // Aumento de tensión armónica
    leader.tension = Math.min(leader.maxTension, leader.tension + 12);
    this.comboCount++;

    // Daño calculado
    const baseDamage = Math.floor(65 + Math.random() * 35);
    enemy.hp = Math.max(0, enemy.hp - baseDamage);
    enemy.stagger = Math.min(enemy.maxStagger, enemy.stagger + 6);

    soundEngine.playAttackHit(leader.id === 'unit_v08' ? 'heavy' : 'sharp');

    eventBus.emit('combat:damage', {
      source: leader.name,
      damage: baseDamage,
      isBasic: true,
      combo: this.comboCount
    });

    eventBus.emit('state:updated');
  }

  /**
   * Ejecuta una habilidad especial seleccionada desde el Dial Radial
   */
  executeDialAction(action) {
    const leader = gameState.getActiveLeader();
    const enemy = gameState.targetEnemy;

    if (leader.tension < action.cost) {
      eventBus.emit('ui:notify', { text: '¡Tensión Armónica insuficiente!' });
      return false;
    }

    // Descontar costo
    leader.tension -= action.cost;

    // Calcular daño
    let damage = Math.floor(action.power * (1.1 + Math.random() * 0.3));
    let staggerGain = Math.floor(action.cost * 0.7);

    // Registrar frecuencia en el analizador de acordes
    const chordResult = resonanceChords.registerFrequency(leader.id, action.freq);

    if (chordResult) {
      // Detonación de Onda Estacionaria
      damage = Math.floor(damage * chordResult.damageMultiplier);
      staggerGain += chordResult.staggerBonus;
      soundEngine.playStandingWaveChord();

      eventBus.emit('combat:chord', chordResult);
    } else {
      soundEngine.playAttackHit('sharp');
    }

    enemy.hp = Math.max(0, enemy.hp - damage);
    enemy.stagger = Math.min(enemy.maxStagger, enemy.stagger + staggerGain);
    enemy.lastAppliedFrequency = action.freq;

    // Recompensa en Ecos y Talentos
    gameState.currencies.brassPounds += Math.floor(damage * 0.08);

    eventBus.emit('combat:damage', {
      source: leader.name,
      actionName: action.name,
      damage,
      freq: action.freq,
      isChord: !!chordResult
    });

    // Cerrar el dial tras ejecutar la orden y retornar a tiempo real
    this.closeTacticalCadence();
    eventBus.emit('state:updated');

    return true;
  }
}

export const hacEngine = new HACEngine();
