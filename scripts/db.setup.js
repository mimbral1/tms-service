import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sql from 'mssql';
import { env } from '../src/config/env.config.js';
import { logger } from '../src/config/logger.config.js';

const rootDir = process.cwd();
const databaseName = env.database.database;

function splitSqlBatches(script) {
  return script
    .split(/^\s*GO\s*;?\s*$/gim)
    .map((batch) => batch.trim())
    .filter(Boolean);
}

async function runSqlFile(pool, filePath) {
  const script = await fs.readFile(filePath, 'utf8');
  const batches = splitSqlBatches(script);

  for (const batch of batches) {
    try {
      await pool.request().batch(batch);
    } catch (error) {
      const alreadyExists =
        error.number === 2714 ||
        error.number === 1913 ||
        /already an object named|already exists/i.test(error.message);

      if (!alreadyExists) {
        throw error;
      }

      logger.warn('SQL batch skipped because object already exists', {
        file: path.relative(rootDir, filePath),
        message: error.message,
      });
    }
  }

  logger.info('SQL file executed', {
    file: path.relative(rootDir, filePath),
  });
}

async function listSqlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

async function connect(database = 'master') {
  return sql.connect({
    ...env.database,
    database,
  });
}

export async function createDatabase() {
  const pool = await connect('master');

  try {
    const result = await pool
      .request()
      .input('DatabaseName', sql.NVarChar(128), databaseName)
      .query(`
        SELECT name
        FROM sys.databases
        WHERE name = @DatabaseName
      `);

    if (result.recordset.length === 0) {
      await pool.request().query(`CREATE DATABASE [${databaseName}]`);
      logger.info('Database created', { database: databaseName });
    } else {
      logger.info('Database already exists', { database: databaseName });
    }
  } finally {
    await pool.close();
  }
}

export async function runMigrations() {
  const pool = await connect(databaseName);

  try {
    const files = await listSqlFiles(path.join(rootDir, 'database', 'migrations'));

    for (const file of files) {
      await runSqlFile(pool, file);
    }

    const viewFiles = await listSqlFiles(path.join(rootDir, 'database', 'views'));

    for (const file of viewFiles) {
      await runSqlFile(pool, file);
    }
  } finally {
    await pool.close();
  }
}

export async function runSeeds() {
  const pool = await connect(databaseName);

  try {
    const preferredOrder = [
      'vehicle-types.seed.sql',
      'settings.seed.sql',
      'demo.seed.sql',
    ];
    const seedDir = path.join(rootDir, 'database', 'seeds');

    for (const fileName of preferredOrder) {
      await runSqlFile(pool, path.join(seedDir, fileName));
    }
  } finally {
    await pool.close();
  }
}

async function main() {
  const command = process.argv[2] || 'all';

  try {
    if (command === 'create' || command === 'all') {
      await createDatabase();
    }

    if (command === 'migrate' || command === 'all') {
      await runMigrations();
    }

    if (command === 'seed' || command === 'all') {
      await runSeeds();
    }

    logger.info('Database setup completed', { command });
    process.exit(0);
  } catch (error) {
    logger.error('Database setup failed', {
      command,
      error,
    });
    process.exit(1);
  }
}

const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  await main();
}
