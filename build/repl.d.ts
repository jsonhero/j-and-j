/// <reference types="node" />
import * as repl from 'repl';
import { INestApplication } from '@nestjs/common';
interface ReplOptions {
    app?: INestApplication;
}
export declare function startRepl(options?: ReplOptions): repl.REPLServer;
export {};
