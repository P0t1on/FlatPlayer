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
