export interface AuthCtx {
  error?: string;
  userDisplay?: string;
}

export type TraceCtx = string;

export interface Contexts {
  auth?: AuthCtx;
  trace?: TraceCtx;
}
