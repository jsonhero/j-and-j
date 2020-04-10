import * as yn from 'yn';
import { INestApplication } from '@nestjs/common';

import { dotEnvironment } from './dotenv';

/**
 * We use require here because we want to ensure dot env files are processed
 * before any other code executes. All other code assume the process.env is
 * setup properly. That includes static code (which is run on import).
 */
async function main(): Promise<void> {
  dotEnvironment();

  const migrations = yn(process.env.ENABLE_DB_MIGRATIONS);
  const application = yn(process.env.ENABLE_API);
  const repl = yn(process.env.ENABLE_REPL);

  // We don't close knex if we plan on using it later
  const closeKnexAfterMigration = !application && !repl;

  let app: INestApplication;

  if (migrations) {
    await require('./database').migrations(closeKnexAfterMigration);
  }
  if (application) {
    app = await require('./application').bootstrap();
  }
  if (repl) {
    await require('./repl').startRepl({ app });
  }
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
