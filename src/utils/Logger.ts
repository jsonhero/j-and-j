/*
Definitions:
  Log Level: The log grain as explained in the best practices. TRACE(0) -> DEBUG(1) -> INFO(2) -> WARN(3) -> ERROR(4) -> CRITICAL(5)
  Log Argument: Any parameter passed to a log method, which acts like console.log(these, are, log, arguments)
  Log Object: A simple json object that makes up a log
  Argument Processor: A special function that will run on an log argument to do processing before being added to the Log Object, this is how we process objects like Errors
  Transports: A function that takes the final LogObject and sends it somewhere (like the console/stdout, file, or an API)
 */

// This is a helper function to strip undefined key/value pairs. JSON does not include undefined
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeUndefined(obj?: Record<string, any>): void {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    Object.entries(obj).forEach(([key, value]) =>
      value === undefined ? delete obj[key] : removeUndefined(obj[key]),
    );
  }
}

export const LOG_TRANSPORTS = {
  JSON_STDOUT: () => (logObject: LogObject) => console.log(JSON.stringify(logObject)),
};

export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  CRITICAL,
}

export type LogError = { name: string; message: string; stack: string; other?: unknown };
export type LogObject = {
  timestamp: string;
  logLevel: string;
  loggerName: string;
  message: string;
  error?: LogError;
  context?: Record<string, unknown>;
};

export type LogArgument = ((logOptions: LoggerOptions) => unknown) | unknown;
export type LogTransport = (logObject: LogObject, logLevel: LogLevel, logOptions: LoggerOptions) => void;

export interface ArgumentProcessor<T = unknown> {
  matcher: (arg: unknown) => boolean;
  processor: (arg: T) => LogArgument;
}

export interface LoggerOptions {
  name: string;
  logLevel: number;
  argumentProcessors: ArgumentProcessor[];
  prefixArguments: unknown[];
  suffixArguments: unknown[];
  transports: LogTransport[];
}

/**
 * Parses the log arguments to be added to the log object
 * @param options
 * @param log
 * @param argument
 */
function processArgument(options: LoggerOptions, log: LogObject, argument: LogArgument): LogObject {
  const resolvedArgument = typeof argument === 'function' ? argument(options) : argument;
  if (resolvedArgument instanceof Error) {
    const { name, message, stack } = resolvedArgument;
    log.error = {
      name,
      message,
      stack,
    };
  } else {
    let processedArgument = resolvedArgument;
    options.argumentProcessors.forEach(({ matcher, processor }) => {
      if (matcher(processedArgument)) {
        processedArgument = processor(processedArgument);
      }
    });

    let messageConcat;
    if (Array.isArray(processedArgument)) {
      processedArgument.forEach((subArgument) => {
        this.processArgument(log, subArgument);
      });
    } else if (['string', 'number', 'boolean', 'symbol'].includes(typeof processedArgument)) {
      messageConcat = processedArgument.toString();
    } else {
      const { message, ...other } = processedArgument;
      removeUndefined(other);
      messageConcat = message;
      if (Object.keys(other).length) {
        if (!log.context) {
          log.context = {};
        }
        Object.assign(log.context, other);
      }
    }

    if (messageConcat) {
      if (log.message === undefined) {
        log.message = messageConcat.toString();
      } else {
        log.message += ` ${messageConcat}`;
      }
    }
  }
  return log;
}

/**
 * The main log function, which will log only if log level is high enough based on settings, and then runs through each log argument to construct the log object.
 * @param options
 * @param logLevel
 * @param logArguments
 */
function log(options: LoggerOptions, logLevel: LogLevel, ...logArguments): void {
  if (logLevel < options.logLevel) {
    return;
  }

  // Form the Log Object
  const log: LogObject = {
    timestamp: new Date().toISOString(),
    logLevel: LogLevel[logLevel],
    loggerName: options.name,
    message: undefined,
    error: undefined,
    context: undefined,
  };

  try {
    // Run through all log arguments to form a complete log object
    const allArguments = [...options.prefixArguments, ...logArguments, ...options.suffixArguments];
    allArguments.forEach((argument) => processArgument(options, log, argument));

    // Transport the Log Object
    options.transports.forEach((transport) => transport(log, logLevel, options));
  } catch (error) {
    console.error('\nError making Log.', error, '\n');
  }
}

export class Logger {
  private readonly options: LoggerOptions;

  constructor(loggerOptions: Partial<LoggerOptions> = {}) {
    this.options = {
      name: 'Global',
      logLevel: process.env.LOG_LEVEL
        ? LogLevel[process.env.LOG_LEVEL.toUpperCase()]
        : LogLevel.INFO,
      argumentProcessors: [],
      prefixArguments: [],
      suffixArguments: [],
      transports: [LOG_TRANSPORTS.JSON_STDOUT()],
      ...loggerOptions,
    };
  }

  trace: Function = (...logArguments) => log(this.options, LogLevel.TRACE, ...logArguments);
  debug: Function = (...logArguments) => log(this.options, LogLevel.DEBUG, ...logArguments);
  info: Function = (...logArguments) => log(this.options, LogLevel.INFO, ...logArguments);
  warn: Function = (...logArguments) => log(this.options, LogLevel.WARN, ...logArguments);
  error: Function = (...logArguments) => log(this.options, LogLevel.ERROR, ...logArguments);
  critical: Function = (...logArguments) => log(this.options, LogLevel.CRITICAL, ...logArguments);

  clone(newLoggerOptions: Partial<LoggerOptions> = {}): Logger {
    return new Logger({ ...this.options, ...newLoggerOptions });
  }
}

let globalLoggerInstance: Logger;
export function setGlobalLoggerOptions(loggerOptions: Partial<LoggerOptions>): void {
  globalLoggerInstance = new Logger(loggerOptions);
}

export function globalLogger(): Logger {
  return globalLoggerInstance || (globalLoggerInstance = new Logger());
}

export function namedLogger(...context: string[]): Logger {
  const name = context.join('.');
  return globalLogger().clone({ name });
}
