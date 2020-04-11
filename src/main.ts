import * as yn from 'yn';

import { dotEnvironment } from './dotenv';

/**
 * We use require here because we want to ensure dot env files are processed
 * before any other code executes. All other code assume the process.env is
 * setup properly. That includes static code (which is run on import).
 */
async function main(): Promise<void> {
  dotEnvironment();
  require('./configureLogger').configureLogger();

  const settings = {
    createDatabase: yn(process.env.CREATE_DB_IF_NOT_EXIST),
    migrations: yn(process.env.ENABLE_DB_MIGRATIONS),
    api: yn(process.env.ENABLE_API),
    repl: yn(process.env.ENABLE_REPL),
  };

  const runners = {
    createDatabase: () => require('./database').createDatabaseIfNotExist(),
    migrations: () => require('./database').migrations(!settings.api && !settings.repl),
    api: () => require('./application').bootstrap(),
    repl: () => require('./repl').startRepl(),
  };

  for (let runner in runners) {
    if (settings[runner]) {
      await runners[runner]();
    }
  }
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
