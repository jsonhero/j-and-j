"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const Context_1 = require("./Context");
class NestJsContext {
    constructor(context, trace) {
        this.context = context;
        this.trace = trace;
    }
}
class NamedLogger {
    constructor(name = 'UNNAMED') {
        this.name = name;
        if (!NamedLogger.winstonLogger) {
            const maxLevelChars = Object.keys(NamedLogger.winstonLevels).reduce((m, k) => Math.max(m, k.length), 0);
            NamedLogger.winstonLogger = winston_1.createLogger({
                level: process.env.LOG_LEVEL,
                levels: NamedLogger.winstonLevels,
                transports: [
                    new winston_1.transports.Console({
                        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf((info) => {
                            const trace = Context_1.Context.trace || '        ';
                            return `${info.timestamp}|${trace}|${info.level
                                .toUpperCase()
                                .padEnd(maxLevelChars)}[${info.loggerName}]${(info.message && ` ${info.message}`) || ''}${NamedLogger.metaToString({ ...info.logMeta })}`;
                        })),
                    }),
                ],
            });
        }
        const levels = Object.keys(NamedLogger.winstonLevels);
        for (const level of levels) {
            this[level] = this.createLogMethod(level);
        }
    }
    static processArgs(...args) {
        let processed = {
            message: '',
            winstonMeta: {},
            logMeta: {},
        };
        for (const arg of args) {
            processed = NamedLogger.ARGUMENT_PROCESSORS.find((argumentProcessor) => argumentProcessor.predicate(arg)).processArg(arg, processed);
        }
        return processed;
    }
    static metaToString(meta) {
        return Object.entries(meta).reduce((str, tuple) => `${str} ${tuple[0]}=${JSON.stringify(tuple[1])}`, '');
    }
    createLogMethod(level) {
        return (...args) => {
            const { message, winstonMeta, logMeta } = NamedLogger.processArgs(...args);
            winstonMeta.loggerName = winstonMeta.loggerName || this.name;
            NamedLogger.winstonLogger.log(level, message, { ...winstonMeta, logMeta });
        };
    }
    asNestLoggerService() {
        return {
            verbose: (message, context) => this['verbose'](message, new NestJsContext(context)),
            debug: (message, context) => this['debug'](message, new NestJsContext(context)),
            log: (message, context) => this['info'](message, new NestJsContext(context)),
            warn: (message, context) => this['warn'](message, new NestJsContext(context)),
            error: (message, trace, context) => this['error'](message, new NestJsContext(context, trace)),
        };
    }
}
exports.NamedLogger = NamedLogger;
NamedLogger.ARGUMENT_PROCESSORS = [
    {
        predicate: (arg) => arg === undefined || arg === null,
        processArg: (arg, result) => result,
    },
    {
        predicate: (arg) => arg instanceof Error,
        processArg: (arg, result) => ({
            ...result,
            logMeta: { ...result.logMeta, stack: arg.stack },
        }),
    },
    {
        predicate: (arg) => arg instanceof NestJsContext,
        processArg: (arg, result) => {
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
        predicate: (arg) => typeof arg === 'object',
        processArg: (arg, result) => ({
            ...result,
            logMeta: { ...result.logMeta, ...arg },
        }),
    },
    {
        predicate: (arg) => typeof arg === 'string' || typeof arg === 'number',
        processArg: (arg, result) => ({
            ...result,
            message: `${result.message}${arg}`,
        }),
    },
];
NamedLogger.winstonLevels = {
    verbose: 6,
    debug: 5,
    info: 4,
    warn: 3,
    error: 2,
    critical: 1,
};
//# sourceMappingURL=Logger.js.map