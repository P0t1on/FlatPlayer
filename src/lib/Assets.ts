import { assets } from '$app/paths';

export function icon(name: string, type: 'svg' | 'webp') {
  return `${assets}/icons/${type}/${name}.${type}`;
}
