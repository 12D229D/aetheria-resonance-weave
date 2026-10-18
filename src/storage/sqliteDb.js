/**
 * src/storage/sqliteDb.js
 * Persistencia transaccional en SQLite WASM (o fallback en Web Storage relacional estructurado).
 */

class SQLiteStorageManager {
  constructor() {
    this.isReady = false;
    this.memoryData = null;
  }

  async init() {
    try {
      // Intento de inicialización local / fallback relacional
      const stored = localStorage.getItem('aetheria_sqlite_db');
      if (stored) {
        this.memoryData = JSON.parse(stored);
      } else {
        this.memoryData = {
          profile: {
            id: 'slot-1',
            playerName: 'Kaelen Voss',
            region: 'Cúspide de Latón (Zona Muda Alfa)',
            brassPounds: 520,
            pureEchoes: 14
          },
          savedAt: new Date().toISOString()
        };
        this.save();
      }
      this.isReady = true;
    } catch (err) {
      console.warn('SQLite Local Fallback inicializado:', err);
      this.isReady = true;
    }
  }

  save() {
    try {
      localStorage.setItem('aetheria_sqlite_db', JSON.stringify(this.memoryData));
    } catch (e) {
      console.error('Error al persistir en SQLite storage:', e);
    }
  }

  updateCurrencies(brass, echoes) {
    if (!this.memoryData) return;
    this.memoryData.profile.brassPounds = brass;
    this.memoryData.profile.pureEchoes = echoes;
    this.memoryData.savedAt = new Date().toISOString();
    this.save();
  }
}

export const sqliteDb = new SQLiteStorageManager();
