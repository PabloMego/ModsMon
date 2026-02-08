import { readFile } from 'fs/promises';
import { Client } from 'pg';

async function run() {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node scripts/run_sql.js <path-to-sql-file>');
    process.exit(2);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Please set DATABASE_URL environment variable (Supabase connection string).');
    process.exit(2);
  }

  try {
    const sql = await readFile(path, { encoding: 'utf8' });
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    console.log('Connected to database — running SQL...');
    await client.query(sql);
    console.log('SQL executed successfully.');
    await client.end();
  } catch (err) {
    console.error('Error executing SQL:', err);
    process.exit(1);
  }
}

run();
