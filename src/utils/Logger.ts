import { LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger as WinstonLogger, createLogger, format, transports } from 'winston';
class NestJsContext {
  constructor(readonly context?: string, readonly trace?: string) {}
}

type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Meta = { [key: string]: any };
type LogArgument = Error | string | number | NestJsContext | Meta | null | undefined;
type ArgumentResult = {
  message: string;
  logMeta: Meta;
  winstonMeta: Meta;
};
type ArgumentProcessor = {
  predicate: (arg: LogArgument) => boolean;
  processArg: (arg: LogArgument, result: ArgumentResult) => ArgumentResult;
};
type LogMethod = (...args: LogArgument[]) => void;
type Logger = { [key in LogLevel]: LogMethod };

export class NamedLogger implements Logger {
  /**
   * You can pass any of the allowed params in any order to a log function. These processors tell winston how
   * to serialize the information passed into a log method. It auto pulls stack traces out of error objects,
   * appends meta as key value pairs, etc.
   */
  private static ARGUMENT_PROCESSORS: ArgumentProcessor[] = [
    {
      // Ignore undefined and null arguments passed to log methods
      predicate: (arg: LogArgument) => arg === undefined || arg === null,
      processArg: (arg: null | undefined, result: ArgumentResult) => result,
    },
    {
      // Add stack traces to logs under "stack" meta key/value
      predicate: (arg: LogArgument) => arg instanceof Error,
      processArg: (arg: Error, result: ArgumentResult) => ({
        ...result,
        logMeta: { ...result.logMeta, stack: arg.stack },
      }),
    },
    {
      // Set NestJs logging specifics. NestJS context is the logger name, and trace is an error stack.
      predicate: (arg: LogArgument) => arg instanceof NestJsContext,
      processArg: (arg: NestJsContext, result: ArgumentResult) => {
        const r = { ...result };
        if (arg.trace) {
          r.logMeta.stack = arg.trace;
        }
        if (arg.context) {
          r.winstonMeta.loggerName = arg.context;
        }
        return r;
      },
    },
    {
      // Any objects passed will be treated as key/value pair meta logs, spread them onto the logMeta.
      predicate: (arg: LogArgument) => typeof arg === 'object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      processArg: (arg: Record<string, any>, result: ArgumentResult) => ({
        ...result,
        logMeta: { ...result.logMeta, ...arg },
      }),
    },
    {
      // Strings make up the message itself, all strings are concated in order they show up in the argument array
      predicate: (arg: LogArgument) => typeof arg === 'string' || typeof arg === 'number',
      processArg: (arg: string, result: ArgumentResult) => ({
        ...result,
        message: `${result.message}${arg}`,
      }),
    },
  ];

  private static processArgs(...args: LogArgument[]): ArgumentResult {
    let processed: ArgumentResult = {
      message: '',
      winstonMeta: {},
      logMeta: {},
    };
    for (const arg of args) {
      processed = NamedLogger.ARGUMENT_PROCESSORS.find(
        (argumentProcessor: ArgumentProcessor): boolean => argumentProcessor.predicate(arg),
      ).processArg(arg, processed);
    }
    return processed;
  }

  private static metaToString(meta: Meta): string {
    /*
    Note that meta key/value pairs can be pulled from log lines using the following regex
    /(\S+)=((?:".*?[^\\]")|\d+|true|false|null|(?:""))/
    Ex.
    Full match  statusCode=200
    Group 1.    statusCode
    Group 2.    200
     */
    return Object.entries(meta).reduce(
      (str, tuple) => `${str} ${tuple[0]}=${JSON.stringify(tuple[1])}`,
      '',
    );
  }

  private static winstonLogger: WinstonLogger;

  private static readonly winstonLevels: { [key in LogLevel]: number } = {
    verbose: 6, // Developer useful logs: fine-grained/performance timings/...
    debug: 5, // Debugging info useful for product owners
    info: 4, // High level event info that is relevant for all consumers of logs
    warn: 3, // Undesired events that are not urgent but should be backlogged for removal
    error: 2, // Urgent undesired events, often sent to pager duty. Useful for all consumers of logs
    critical: 1, // Event of extraordinary impact is occurring - highest of priority, would likely be 24/7 pager duty
  };

  readonly verbose: LogMethod;
  readonly info: LogMethod;
  readonly debug: LogMethod;
  readonly warn: LogMethod;
  readonly error: LogMethod;
  readonly critical: LogMethod;

  constructor(private readonly name: string = 'UNNAMED') {
    if (!NamedLogger.winstonLogger) {
      const maxLevelChars = Object.keys(NamedLogger.winstonLevels).reduce(
        (m, k) => Math.max(m, k.length),
        0,
      );
      NamedLogger.winstonLogger = createLogger({
        level: process.env.LOG_LEVEL,
        levels: NamedLogger.winstonLevels,
        transports: [
          new transports.Console({
            format: format.combine(
              format.timestamp(),
              format.printf((info: Meta) => {
                return `${info.timestamp}|${info.level
                  .toUpperCase()
                  .padEnd(maxLevelChars)}[${info.loggerName}]${
                  (info.message && ` ${info.message}`) || ''
                }${NamedLogger.metaToString({ ...info.logMeta })}`;
              }),
            ),
          }),
        ],
      });
    }

    // Create each level of logging
    const levels: LogLevel[] = Object.keys(NamedLogger.winstonLevels) as LogLevel[];
    for (const level of levels) {
      this[level] = this.createLogMethod(level);
    }
  }

  private createLogMethod(level: LogLevel): LogMethod {
    return (...args: LogArgument[]): void => {
      const { message, winstonMeta, logMeta } = NamedLogger.processArgs(...args);
      winstonMeta.loggerName = winstonMeta.loggerName || this.name;
      NamedLogger.winstonLogger.log(level, message, { ...winstonMeta, logMeta });
    };
  }

  asNestLoggerService(): NestLoggerService {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      verbose: (message: any, context?: string) =>
        this['verbose'](message, new NestJsContext(context)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      debug: (message: any, context?: string) => this['debug'](message, new NestJsContext(context)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      log: (message: any, context?: string) => this['info'](message, new NestJsContext(context)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      warn: (message: any, context?: string) => this['warn'](message, new NestJsContext(context)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (message: any, trace?: string, context?: string) =>
        this['error'](message, new NestJsContext(context, trace)),
    };
  }
}