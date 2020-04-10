import { createHook, executionAsyncId } from 'async_hooks';

import { Contexts, Undef } from '../types';

/*
 NOTE: if we run into problems then maybe the bug talked about in CLS_HOOKED is real and needs to be dealt with.
  So far this implementation seems to work great.
  https://github.com/Jeff-Lewis/cls-hooked/blob/master/context.js#L349-L364
 */
const contexts: {
  [key: number]: Contexts;
} = {};

const children: {
  [key: number]: number;
} = {};

// For debugging purposes
// setInterval(() => console.log('Contexts active:', Object.keys(contexts).length, Object.entries(children).reduce((r, [, contextId]) => ({ ...r, [contextId]: (r[contextId] || 0) + 1 }), {})), 1000);

function getContextByAsyncId(
  asyncId: number,
): [Undef<number>, Undef<Contexts>] {
  const contextId: number = children[asyncId] || asyncId;
  const context: Undef<Contexts> = contexts[contextId];
  return [context && contextId, context];
}

function clearContext(contextId: number): void {
  if (contexts[contextId]) {
    delete contexts[contextId];
    Object.entries(children).forEach(([childId, parentId]) => {
      if (parentId === contextId) {
        delete children[childId];
      }
    });
  }
}

const hooks = createHook({
  init(asyncId: number, type: string, triggerAsyncId: number): void {
    const [contextId] = getContextByAsyncId(triggerAsyncId);
    if (contextId !== undefined) {
      // // @ts-ignore _rawDebug is important here, if you try to console.log you'll get an infinite recursion in this method.
      // process._rawDebug(`${require('util').format('attaching child', asyncId, 'to context id', contextId, type)}`);
      children[asyncId] = contextId;
    }
  },
  destroy(asyncId: number): void {
    // NOTE: destroy is called by the garbage collector, and may not be called immediately after a promise resolving.
    //  It is important to use clearContext if you want to free up memory explicitly and quickly.
    if (contexts[asyncId]) {
      clearContext(asyncId);
    }
  },
});
hooks.enable();

function setContext<T extends keyof Contexts>(
  key: T,
  value: Contexts[T] /*, ttl = 10000*/,
): void {
  const asyncId = executionAsyncId();
  const contextId = children[asyncId] || asyncId;
  if (!contexts[contextId]) {
    contexts[contextId] = {};
  }
  contexts[contextId][key] = value;

  // if (ttl > 0) {
  //   // Backup for if destroy never gets called, which may happen. We will only keep contexts alive for some amount of time.
  //   setTimeout(clearContext, ttl, contextId);
  // }
}

function getContext<T extends keyof Contexts>(key: T): Undef<Contexts[T]> {
  const asyncId = executionAsyncId();
  const contextId = children[asyncId] || asyncId;
  if (!contexts[contextId]) {
    return undefined;
  }
  return contexts[contextId][key];
}

interface ContextSnapshot extends Contexts {
  contextId?: number;
  // destructure any new vars out in below method Context.setFromSnapshot
}

interface Context extends Contexts {
  snapshot: ContextSnapshot;
  clearContext: (contextId: number) => void;
  setFromSnapshot: (snapshot: ContextSnapshot) => void;
}

// If you want to add context then edit the type file in the types directory. This proxy object
//  is setup to automatically have setters and getters for all context defined in the type file.
export const Context: Context = new Proxy<Context>(
  {
    get snapshot(): ContextSnapshot {
      const [contextId, context] = getContextByAsyncId(executionAsyncId());
      const snapshot: ContextSnapshot = {};
      if (contextId) {
        snapshot.contextId = contextId;
        Object.assign(snapshot, context);
      }
      return snapshot;
    },
    clearContext: (contextId: number) => {
      clearContext(contextId);
    },
    setFromSnapshot: (snapshot: ContextSnapshot) => {
      // We always want to pull off non Contexts from snapshot object so we don't assign invalid contexts.
      //  I don't want to list the contexts here because that would require a dev to edit this file on simple
      //  context interface changes in the types folder. Generally speaking a dev will never need to touch this
      //  file as it is just the implementation.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { contextId, ...contexts } = snapshot;
      Object.assign(Context, contexts);
    },
  },
  {
    get<K extends keyof Contexts>(t: Context, key: K): Contexts[K] {
      return t[key] || getContext(key);
    },
    set<K extends keyof Contexts>(
      t: Context,
      key: K,
      value: Undef<Contexts[K]>,
    ): boolean {
      setContext(key, value);
      return true;
    },
  },
);

// TODO export a close method that is called onApplicationShutdown in nest to clear out any listeners/processes
