import * as Knex from 'knex';
import { Injectable } from '@nestjs/common';

import { Logger, namedLogger } from '../../utils';
import { DatabaseRootModel } from '../../models';
import { MigratorConfig, PgConnectionConfig } from "knex"

const migrationsConfig: Knex.MigratorConfig = {
  directory: `${__dirname}/../../../migrations`,
  tableName: 'knex_migrations',
  loadExtensions: ['.js'], // Needed so it doesn't try to run .d.ts files
};

const knexConfig: { client: string, connection: PgConnectionConfig, migrations: MigratorConfig } = {
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_SCHEMA,
    port: parseInt(process.env.DATABASE_PORT),
  },
  migrations: migrationsConfig,
};

@Injectable()
export class DatabaseService {
  private static readonly logger: Logger = namedLogger(
    DatabaseService.name,
  );

  private static globalKnexInstance: Knex;

  constructor() {
    if (!DatabaseService.globalKnexInstance) {
      DatabaseService.globalKnexInstance = Knex(knexConfig);
      DatabaseRootModel.knex(DatabaseService.globalKnexInstance);
    }
  }

  static async closeKnex(): Promise<void> {
    if (DatabaseService.globalKnexInstance) {
      DatabaseRootModel.knex(undefined);
      await DatabaseService.globalKnexInstance.destroy();
      DatabaseService.globalKnexInstance = undefined;
    }
  }

  static async createDatabaseIfNotExist(): Promise<void> {
    DatabaseService.logger.trace('createDatabaseIfNotExist called');
    const noSchemaConfig = { ...knexConfig, connection: { ...knexConfig.connection, database: undefined }, pool: { min: 1, max: 1 } };
    const noSchemaKnex = Knex(noSchemaConfig);

    const datname = process.env.DATABASE_SCHEMA;

    const result = await noSchemaKnex('pg_catalog.pg_database').count().where({ datname });

    if (!result[0].count) {
      DatabaseService.logger.info(`Database ${datname} does not exist, creating...`);
      await noSchemaKnex.raw(`CREATE DATABASE ${datname};`);
    }
    DatabaseService.logger.info(`Database ${datname} already exists, not creating.`);

    await noSchemaKnex.destroy();
  }

  async runMigrations(): Promise<void> {
    DatabaseService.logger.trace(`Running migrations.`);
    await DatabaseService.globalKnexInstance.migrate.latest(
      migrationsConfig,
    );
  }

  async isFullyMigrated(): Promise<boolean> {
    DatabaseService.logger.trace(`Checking migration status.`);
    try {
      const status = await DatabaseService.globalKnexInstance.migrate.status(migrationsConfig);
      DatabaseService.logger.trace(
        `\tknex_migrations table status: ${status}`,
      );
      return status >= 0;
    } catch (error) {
      const doesNotExist = error.message.includes(
        'relation "knex_migrations" does not exist',
      );
      DatabaseService.logger.trace(
        `\tErrored querying migration status: ${error.message}. Does not exist: ${doesNotExist}`,
      );
      if (doesNotExist) {
        return false;
      }
      throw error;
    }
  }
}
