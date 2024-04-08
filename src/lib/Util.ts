import { assets } from '$app/paths';

export function icon(name: string, type: 'svg' | 'webp' = 'svg') {
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
