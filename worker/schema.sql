-- schema.sql — Esquema D1 SQLite para Aetheria: Resonance of the Weave

-- Perfiles de usuario y partidas guardadas
CREATE TABLE IF NOT EXISTS save_profiles (
    id TEXT PRIMARY KEY,
    player_name TEXT NOT NULL,
    current_region TEXT NOT NULL DEFAULT 'Valle de las Cuerdas',
    playtime_seconds INTEGER NOT NULL DEFAULT 0,
    brass_pounds INTEGER NOT NULL DEFAULT 150,
    pure_echoes INTEGER NOT NULL DEFAULT 0,
    last_saved_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Estado de los miembros de la party
CREATE TABLE IF NOT EXISTS party_status (
    profile_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    current_hp INTEGER NOT NULL,
    max_hp INTEGER NOT NULL,
    harmonic_tension REAL NOT NULL DEFAULT 0.0,
    unlocked_slots INTEGER NOT NULL DEFAULT 3,
    PRIMARY KEY (profile_id, member_id),
    FOREIGN KEY (profile_id) REFERENCES save_profiles(id) ON DELETE CASCADE
);

-- Inventario de Vectores de Tono
CREATE TABLE IF NOT EXISTS tone_vectors_inventory (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL,
    vector_name TEXT NOT NULL,
    frequency_type TEXT NOT NULL, -- 'Aguda', 'Media', 'Grave'
    timbre_family TEXT NOT NULL,  -- 'Cinetico', 'Armonico', 'Sismico'
    resonance_power INTEGER NOT NULL DEFAULT 10,
    equipped_to TEXT,
    slot_index INTEGER,
    FOREIGN KEY (profile_id) REFERENCES save_profiles(id) ON DELETE CASCADE
);

-- Telemetría de encuentros y combates HAC
CREATE TABLE IF NOT EXISTS combat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id TEXT NOT NULL,
    enemy_name TEXT NOT NULL,
    chords_detonated INTEGER NOT NULL DEFAULT 0,
    standing_waves_formed INTEGER NOT NULL DEFAULT 0,
    damage_dealt INTEGER NOT NULL,
    result TEXT NOT NULL, -- 'VICTORY', 'DEFEAT', 'FLED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES save_profiles(id) ON DELETE CASCADE
);
