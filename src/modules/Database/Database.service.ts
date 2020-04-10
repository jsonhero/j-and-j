import * as Knex from 'knex';
import { Injectable } from '@nestjs/common';

import { NamedLogger } from '../../utils';
import { BaseModel } from '../../models';

@Injectable()
export class DatabaseService {
  private static readonly logger: NamedLogger = new NamedLogger(
    DatabaseService.name,
  );
  private static readonly knexMigrations: Knex.MigratorConfig = {
    directory: `${__dirname}/../../../database_migrations`,
    tableName: 'knex_migrations',
    // we run migrations from the transpiled js output of ts. This will
    //   ignore .d.ts files which get picked up by the default configuration
    loadExtensions: ['.js'],
  };
  private static readonly knexConfig: Knex.Config = {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_SCHEMA,
      port: parseInt(process.env.DATABASE_PORT),
    },
    migrations: DatabaseService.knexMigrations,
  };

  // We only need to make one knex connection to the db.
  private static _knex: Knex = Knex(DatabaseService.knexConfig);
  private static getKnex = (): Knex =>
    DatabaseService._knex ||
    (DatabaseService._knex = Knex(DatabaseService.knexConfig));

  static async closeKnex(): Promise<void> {
    if (DatabaseService._knex) {
      await DatabaseService._knex.destroy();
      // eslint-disable-next-line require-atomic-updates
      DatabaseService._knex = undefined;
    }
  }

  constructor() {
    if (!BaseModel.knex()) {
      BaseModel.knex(DatabaseService.getKnex());
    }
  }

  async runMigrations(): Promise<void> {
    DatabaseService.logger.verbose(`Running migrations.`);
    await DatabaseService.getKnex().migrate.latest(
      DatabaseService.knexMigrations,
    );
  }

  // async rollbackMigration(all?: boolean): Promise<void> {
  //   DatabaseService.logger.verbose(`Running rollback. ${all ? 'Full rollback' : 'Last migration'}`);
  //   await DatabaseService.getKnex().migrate.rollback(DatabaseService.knexMigrations, all);
  // }

  async isFullyMigrated(): Promise<boolean> {
    DatabaseService.logger.verbose(`Checking migration status.`);
    try {
      const status = await DatabaseService.getKnex().migrate.status(
        DatabaseService.knexMigrations,
      );
      DatabaseService.logger.verbose(
        `\tknex_migrations table status: ${status}`,
      );
      return status >= 0;
    } catch (error) {
      const doesNotExist = error.message.includes(
        'relation "knex_migrations" does not exist',
      );
      DatabaseService.logger.verbose(
        `\tErrored querying migration status: ${error.message}. Does not exist: ${doesNotExist}`,
      );
      if (doesNotExist) {
        return false;
      }
      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    DatabaseService.logger.verbose(
      `Checking database connection health with a "SELECT 1;"`,
    );
    try {
      const ping = await DatabaseService.getKnex().raw('SELECT 1 AS pong;');
      DatabaseService.logger.verbose(`\tSelect 1 result: ${ping.rows[0].pong}`);
      return true;
    } catch (error) {
      DatabaseService.logger.verbose(`\tSelect 1 failed: ${error}`);
      return false;
    }
  }
}
