import { DatabaseService } from './modules';
import { namedLogger } from './utils';

export async function createDatabaseIfNotExist(): Promise<void> {
  await DatabaseService.createDatabaseIfNotExist();
}

export async function migrations(closeKnexOnFinish = true): Promise<void> {
  const logger = namedLogger('Migrations');
  logger.info(
    'Database migrations enabled: Checking status of the database...',
  );
  const databaseService = new DatabaseService();
  if (await databaseService.isFullyMigrated()) {
    logger.info('Migrations are up to date, skipping migrations.');
  } else {
    logger.info('Migrations are out of date, running...');
    await databaseService.runMigrations();
    logger.info(`\tFinished migrating the database.`);
  }
  if (closeKnexOnFinish) {
    await DatabaseService.closeKnex();
  }
}
