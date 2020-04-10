import * as fs from 'fs';
import * as path from 'path';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

import { NamedLogger } from './utils';

export function dotEnvironment(): void {
  // Same logic as create-react-app for resolving env files
  // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/env.js
  const NODE_ENV = process.env.NODE_ENV.toLowerCase();
  const appDirectory = fs.realpathSync(process.cwd());
  const dotenvFilePath = path.resolve(appDirectory, '.env');

  const dotenvFiles = [
    `${dotenvFilePath}.${NODE_ENV}.local`,
    `${dotenvFilePath}.${NODE_ENV}`,
    NODE_ENV !== 'test' && `${dotenvFilePath}.local`,
    dotenvFilePath,
  ].filter(Boolean);

  const propsConfigured = {};
  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      const { parsed } = dotenvExpand(dotenv.config({ path: dotenvFile }));
      Object.assign(propsConfigured, parsed);
    }
  });

  const logger = new NamedLogger('Dotenv');
  logger.debug('Environment variables loaded from dotenvs: ', Object.keys(propsConfigured).length);
}