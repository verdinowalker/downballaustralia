### Import players from CSV

A small Node script is included to import players from the provided CSV into your Supabase database.

Usage:
1. Copy `.env.example` to `.env.local` and fill NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).
2. Install dependencies: npm install
3. Run: npm run import:players

The script will upsert teams by name and insert players into the `players` table. It skips rows where "Is Player" is not set to Yes.

Note: Review the `scripts/import_players.js` file and adjust mappings if your CSV columns differ.
