/**
 * Database Connection Management
 * TypeORM DataSource configuration and connection handling
 */

import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from '../config/config';
import { Decision, Citation, CacheEntry } from './entities';
import { DatabaseConnectionError } from '../errors/errors';

/**
 * Create TypeORM DataSource from configuration
 */
export function createDataSource(config: DatabaseConfig): DataSource {
  const baseOptions: Partial<DataSourceOptions> = {
    entities: [Decision, Citation, CacheEntry],
    synchronize: false, // Use migrations in production
    logging: ['error', 'warn'],
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    migrationsRun: false, // Run migrations manually
  };

  let options: DataSourceOptions;

  if (config.type === 'postgres') {
    if (!config.host || !config.port || !config.username || !config.password) {
      throw new DatabaseConnectionError(
        'PostgreSQL configuration missing required fields: host, port, username, password'
      );
    }

    options = {
      ...baseOptions,
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      poolSize: config.poolSize,
      extra: {
        max: config.poolSize,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
      },
    } as DataSourceOptions;
  } else if (config.type === 'sqlite') {
    options = {
      ...baseOptions,
      type: 'better-sqlite3',
      database: config.database,
      prepareDatabase: (db: unknown) => {
        // Enable WAL mode for better concurrency
        (db as { pragma: (sql: string) => void }).pragma('journal_mode = WAL');
        // Enable foreign keys
        (db as { pragma: (sql: string) => void }).pragma('foreign_keys = ON');
      },
    } as DataSourceOptions;
  } else {
    throw new DatabaseConnectionError(
      `Unsupported database type: ${config.type}`
    );
  }

  return new DataSource(options);
}

/**
 * Database connection singleton
 */
let dataSourceInstance: DataSource | null = null;

export async function getDataSource(config?: DatabaseConfig): Promise<DataSource> {
  if (!dataSourceInstance) {
    if (!config) {
      throw new DatabaseConnectionError(
        'DataSource not initialized. Call getDataSource with config first.'
      );
    }

    dataSourceInstance = createDataSource(config);

    try {
      await dataSourceInstance.initialize();
    } catch (error) {
      dataSourceInstance = null;
      throw new DatabaseConnectionError(
        `Failed to initialize database: ${(error as Error).message}`
      );
    }
  }

  if (!dataSourceInstance.isInitialized) {
    try {
      await dataSourceInstance.initialize();
    } catch (error) {
      throw new DatabaseConnectionError(
        `Failed to initialize database: ${(error as Error).message}`
      );
    }
  }

  return dataSourceInstance;
}

/**
 * Close database connection
 */
export async function closeDataSource(): Promise<void> {
  if (dataSourceInstance && dataSourceInstance.isInitialized) {
    await dataSourceInstance.destroy();
    dataSourceInstance = null;
  }
}

/**
 * Reset database connection (useful for testing)
 */
export async function resetDataSource(): Promise<void> {
  await closeDataSource();
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(dataSource: DataSource): Promise<boolean> {
  try {
    await dataSource.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Run database migrations
 */
export async function runMigrations(dataSource: DataSource): Promise<void> {
  try {
    await dataSource.runMigrations();
  } catch (error) {
    throw new DatabaseConnectionError(
      `Failed to run migrations: ${(error as Error).message}`
    );
  }
}

/**
 * Revert last migration
 */
export async function revertMigration(dataSource: DataSource): Promise<void> {
  try {
    await dataSource.undoLastMigration();
  } catch (error) {
    throw new DatabaseConnectionError(
      `Failed to revert migration: ${(error as Error).message}`
    );
  }
}
