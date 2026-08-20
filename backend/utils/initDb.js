const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const initDatabase = async () => {
  const host = process.env.PGHOST || 'localhost';
  const port = process.env.PGPORT || 5432;
  const user = process.env.PGUSER || 'postgres';
  const password = process.env.PGPASSWORD || 'rakshu123';
  const targetDb = process.env.PGDATABASE || 'gym_db';

  try {
    const client = new Client({ user, password, host, port, database: 'postgres' });
    await client.connect();
    console.log(`[Database Init] Authenticated with user '${user}' successfully.`);

    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [targetDb]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`[Database Init] Created database '${targetDb}' successfully.`);
    } else {
      console.log(`[Database Init] Database '${targetDb}' already exists.`);
    }
    await client.end();
  } catch (error) {
    console.error('[Database Init Error]:', error.message);
    process.exit(1);
  }
};

initDatabase();
