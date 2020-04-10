import { DatabaseService } from './modules';
import { NamedLogger } from './utils';

export async function migrations(closeKnexOnFinish = true): Promise<void> {
  const logger = new NamedLogger('Migrations');
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
