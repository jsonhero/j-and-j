import * as Ajv from 'ajv';
import * as fs from 'fs';
import * as path from 'path';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: [
    'PORT',
    'LOG_LEVEL',
    'CREATE_DB_IF_NOT_EXIST',
    'HUMAN_READABLE_LOGS',
    'ENABLE_DB_MIGRATIONS',
    'ENABLE_API',
    'ENABLE_REPL',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'DATABASE_SCHEMA',
  ],
  properties: {
    PORT: { $ref: '#/definitions/numString' },
    LOG_LEVEL: { type: 'string', pattern: '^(?:trace|debug|info|warn|error|critical)$' },
    HUMAN_READABLE_LOGS: { $ref: '#/definitions/boolString' },
    CREATE_DB_IF_NOT_EXIST: { $ref: '#/definitions/boolString' },
    ENABLE_DB_MIGRATIONS: { $ref: '#/definitions/boolString' },
    ENABLE_API: { $ref: '#/definitions/boolString' },
    ENABLE_RECONCILE: { $ref: '#/definitions/boolString' },
    DATABASE_HOST: { $ref: '#/definitions/hostname' },
    DATABASE_PORT: { $ref: '#/definitions/numString' },
    DATABASE_USER: { $ref: '#/definitions/nonEmptyString' },
    DATABASE_PASSWORD: { type: 'string' },
    DATABASE_SCHEMA: { $ref: '#/definitions/nonEmptyString' },
  },
  definitions: {
    boolString: {
      type: 'string',
      // This is based on the `yn` package that converts strings to booleans
      //   https://github.com/sindresorhus/yn/blob/master/index.js
      pattern:
        '^(?:[yY]|(?:[yY][eE][sS])|(?:[tT][rR][uU][eE])|1|[nN]|(?:[nN][oO])|(?:[fF][aA][lL][sS][eE])|0)$',
      errorMessage: 'Must match the regex /^(?:y|yes|true|1|n|no|false|0)$/i',
    },
    numString: {
      type: 'string',
      pattern: '^\\d+$',
    },
    nonEmptyString: {
      type: 'string',
      minLength: 1,
    },
    hostname: {
      type: 'string',
      format: 'hostname',
    },
  },
};

export function validateEnvVariables(): void {
  const ajv = new Ajv({ allErrors: true });
  const valid = ajv.validate(schema, process.env);
  if (!valid) {
    let errorMessage = '';
    ajv.errors.forEach((error) => {
      if (error.dataPath) {
        console.error(
          `Environment variable ${error.dataPath.slice(1)} is invalid: ${error.message}.`,
        );
      } else {
        console.error(`Environment configuration is invalid: ${error.message}`);
      }
      errorMessage += `\t${error.message}`;
    });
    throw new Error(`Failed to validate environment variables. ${errorMessage}`);
  }
}

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

  validateEnvVariables();
}
