import { assets } from '$app/paths';
import SvgIcon from './SVGIcon.svelte';

export type IconNames = 'close' | 'play' | 'search' | 'sports_esports' | 'done';

export function icon(name: IconNames, type: 'svg' | 'webp' = 'webp') {
  return `${assets}/icons/${type}/${name}.${type}`;
}

export { SvgIcon };

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
