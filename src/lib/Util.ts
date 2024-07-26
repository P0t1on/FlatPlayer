import { assets } from '$app/paths';

export type IconNames =
  | 'arrow_drop_down'
  | 'arrow_drop_up'
  | 'arrow_left'
  | 'arrow_right'
  | 'close'
  | 'delete'
  | 'done'
  | 'keyboard_arrow_down'
  | 'keyboard_arrow_left'
  | 'keyboard_arrow_right'
  | 'keyboard_arrow_up'
  | 'play'
  | 'search'
  | 'sports_esports';

export function icon(name: IconNames, type: 'svg' | 'webp' = 'webp') {
  return `${assets}/icons/${type}/${name}.${type}`;
}

const get = (id: string) => localStorage.getItem('config_' + id);

export function getConfig<T = any>(
  id: string,
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' = 'string',
  defaultValue?: T
): T | undefined {
  switch (type) {
    case 'number':
    case 'array':
    case 'object':
    case 'boolean': {
      const v = get(id);
      if (v !== null) return JSON.parse(v);
      break;
    }

    case 'string': {
      const v = get(id);
      // @ts-ignore
      if (v !== null) return v;
      break;
    }
  }

  return defaultValue ?? undefined;
}

let uids: number[];

export function getUid() {
  if (uids.length < 1) {
    const data = new Uint32Array(100);
    crypto.getRandomValues(data);
    new Array(...data);
  }

  return uids.shift() as number;
}

export class EventManager<M extends { [key: number | string | symbol]: any }> {
  private listener: { [K in keyof M]: Set<(arg: M[K]) => void> } =
    {} as typeof this.listener;

  public constructor() {}

  public emit<K extends keyof M>(key: K, args: M[K]): void {
    const listenerList = this.listener[key];

    if (listenerList === undefined) return;

    for (const listener of listenerList) {
      listener(args);
    }
  }

  public async emitThen<K extends keyof M>(key: K, args: M[K]) {
    const handlers = this.listener[key];

    if (handlers === undefined) return;

    for await (const handler of handlers) {
      handler(args);
    }

    return;
  }

  public on<K extends keyof M>(key: K, handler: (arg: M[K]) => void) {
    let handlers = this.listener[key];

    if (handlers === undefined) {
      handlers = this.listener[key] = new Set();
    }

    handlers.add(handler);

    return () => handlers.delete(handler);
  }

  public once<K extends keyof M>(key: K, handler: (arg: M[K]) => void) {
    let handlers = this.listener[key];

    if (handlers === undefined) {
      handlers = this.listener[key] = new Set();
    }

    const wrapper: typeof handler = (v) => {
      handler(v);
      handlers.delete(wrapper);
    };

    handlers.add(wrapper);

    return () => handlers.delete(wrapper);
  }
}

const test = new EventManager<{
  321: number;
  513: string;
}>();
