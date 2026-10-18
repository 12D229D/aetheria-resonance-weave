/**
 * worker/index.js — Cloudflare Worker API para Aetheria: Resonance of the Weave
 * Maneja sincronización de perfiles, inventario y telemetría de combate contra D1 SQLite.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // Cabeceras CORS abiertas para SPA
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Endpoint: Obtener o crear perfil
      if (url.pathname === '/api/profile' && method === 'GET') {
        const profileId = url.searchParams.get('id') || 'default-slot';
        let profile = null;
        if (env.DB) {
          profile = await env.DB.prepare('SELECT * FROM save_profiles WHERE id = ?').bind(profileId).first();
        }

        return new Response(JSON.stringify({
          success: true,
          profile: profile || {
            id: profileId,
            player_name: 'Kaelen Voss',
            current_region: 'Cúspide de Latón (Zona Muda Alfa)',
            brass_pounds: 450,
            pure_echoes: 12
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Endpoint: Guardar progreso del combate
      if (url.pathname === '/api/combat-log' && method === 'POST') {
        const body = await request.json();
        if (env.DB) {
          await env.DB.prepare(`
            INSERT INTO combat_logs (profile_id, enemy_name, chords_detonated, standing_waves_formed, damage_dealt, result)
            VALUES (?, ?, ?, ?, ?, ?)
          `).bind(
            body.profile_id || 'default-slot',
            body.enemy_name,
            body.chords_detonated || 0,
            body.standing_waves_formed || 0,
            body.damage_dealt || 0,
            body.result || 'VICTORY'
          ).run();
        }

        return new Response(JSON.stringify({ success: true, saved: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ message: 'Aetheria Cloudflare API v1.0 Activa' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
