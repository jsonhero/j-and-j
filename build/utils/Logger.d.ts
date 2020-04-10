import { LoggerService as NestLoggerService } from '@nestjs/common';
declare class NestJsContext {
    readonly context?: string;
    readonly trace?: string;
    constructor(context?: string, trace?: string);
}
declare type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical';
declare type Meta = {
    [key: string]: any;
};
declare type LogArgument = Error | string | number | NestJsContext | Meta | null | undefined;
declare type LogMethod = (...args: LogArgument[]) => void;
declare type Logger = {
    [key in LogLevel]: LogMethod;
};
export declare class NamedLogger implements Logger {
    private readonly name;
    private static ARGUMENT_PROCESSORS;
    private static processArgs;
    private static metaToString;
    private static winstonLogger;
    private static readonly winstonLevels;
    readonly verbose: LogMethod;
    readonly info: LogMethod;
    readonly debug: LogMethod;
    readonly warn: LogMethod;
    readonly error: LogMethod;
    readonly critical: LogMethod;
    constructor(name?: string);
    private createLogMethod;
    asNestLoggerService(): NestLoggerService;
}
export {};
