import type { Writable } from 'svelte/store';

export type ItemType = {
  name: string;
  description: string;
  max: number | false;
};

export type ActionType = {
  id: string;
  name: string;
  method: () => void;
  paused: Writable<boolean>;
  cooltime:
    | false
    | {
        max: number;
        current: Writable<number>;
      };
};

export type ItemManagerType = {
  set(
    id: string,
    value: number,
    type?: {
      name?: string;
      description?: string;
      max?: number | false;
    }
  ): {
    value: Writable<number>;
  } & ItemType;

  change(
    id: string,
    setter: (prevVal: number) => number
  ):
    | ({
        value: Writable<number>;
      } & ItemType)
    | undefined;
};
