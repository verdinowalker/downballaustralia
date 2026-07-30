const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const csvPath = path.join(__dirname, '..', 'data', 'team_roster_members_20260727_041013(2).csv');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in your environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

async function findOrCreateTeam(name) {
  if (!name) name = 'Unknown Team';
  name = name.trim();
  const { data, error } = await supabase.from('teams').select('id').eq('name', name).limit(1).maybeSingle();
  if (error) throw error;
  if (data && data.id) return data.id;
  // create
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  const { data: created, error: err } = await supabase.from('teams').insert({ name, slug }).select('id').single();
  if (err) throw err;
  return created.id;
}

function generateSlug(name) {
  return (name || 'player').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

function parseName(full) {
  if (!full) return { first: null, last: null };
  const parts = full.trim().split(/\s+/);
  return { first: parts[0], last: parts.slice(1).join(' ') || null };
}

function parseHeight(positionField) {
  if (!positionField) return null;
  const m = positionField.match(/(\d{2,3})\s*cm/i);
  if (m) return parseInt(m[1], 10);
  return null;
}

(async () => {
  const csv = fs.readFileSync(csvPath, 'utf8');
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
  const rows = parsed.data;
  console.log(`Parsed ${rows.length} rows`);

  let inserted = 0;
  for (const row of rows) {
    try {
      const playerName = row['Player Name']?.trim();
      const teamName = row['Team Name']?.trim();
      const jersey = row['Jersey Number']?.trim();
      const position = row['Position']?.trim();
      const isPlayer = (row['Is Player'] || '').toLowerCase().startsWith('y');

      // Skip non-player personnel
      if (!isPlayer) {
        console.log(`Skipping non-player: ${playerName}`);
        continue;
      }

      const team_id = await findOrCreateTeam(teamName);
      const { first, last } = parseName(playerName);
      const slug = generateSlug(playerName + '-' + (teamName || ''));
      const height_cm = parseHeight(position);
      const number = jersey ? parseInt(jersey, 10) : null;

      const payload = {
        team_id,
        first_name: first,
        last_name: last,
        slug,
        photo: null,
        position: position || null,
        number: number,
        height_cm: height_cm,
        nationality: teamName || null,
        bio: null
      };

      const { data, error } = await supabase.from('players').insert(payload).select('id').single();
      if (error) {
        console.error('Insert error for', playerName, error.message);
      } else {
        inserted++;
      }
    } catch (err) {
      console.error('Row error', err.message);
    }
  }

  console.log(`Inserted ${inserted} players`);
})();
