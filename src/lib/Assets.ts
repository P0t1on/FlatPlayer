import { assets } from '$app/paths';

export function icon(name: string, type: 'svg' | 'webp' = 'svg') {
  return `${assets}/icons/${type}/${name}.${type}`;
}
