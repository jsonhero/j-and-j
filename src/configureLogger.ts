import * as yn from 'yn';
import * as chalk from "chalk";

import { LOG_TRANSPORTS, LogLevel, LogObject, removeUndefined, setGlobalLoggerOptions } from './utils';

const humanReadableTransport = (logObject: LogObject, logLevel: LogLevel) => {
    removeUndefined(logObject);
    const toLog = Object.entries(logObject).map(([key, value]) => {
      switch (key) {
        case 'logLevel':
          return [chalk.cyan, chalk.blueBright, chalk.white, chalk.yellow, chalk.red, chalk.redBright.bgRed][logLevel](value.toString().padStart(8));
        case 'timestamp':
          return chalk.gray(value);
        case 'loggerName':
          return chalk.green(value);
        case 'message':
          return value;
        case 'error': {
          const { name, message, stack } = (value as unknown) as Error;
          if (stack) {
            return chalk.yellow(`⮐\n\tError ┅ ${stack.replace(/\n/g, '\n\t')}`);
          } else {
            return chalk.yellow(`⮐\n\tError ┅ ${name} - ${message}`);
          }
        }
        default: {
          let msg = '⮐\n\tContext ┅ ';
          let lineLength = 0;
          Object.entries(value).forEach(([key, value]) => {
            const data = `${key}: ${JSON.stringify(value)}`;
            if (lineLength + data.length > 120) {
              msg += `\n\t${data}`;
              lineLength = data.length;
            } else {
              if (lineLength) {
                msg += ' | ';
              }
              msg += data;
              lineLength += data.length + 3;
            }
          });
          return msg;
        }
      }
    });
    console.log(toLog.join('  |  '));
  };

export function configureLogger(): void {
  if (yn(process.env.HUMAN_READABLE_LOGS)) {
    setGlobalLoggerOptions({
      transports: [humanReadableTransport],
    });
  }
}
