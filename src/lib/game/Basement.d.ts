import type { Writable } from 'svelte/store';

export type ItemType = {
  name: string;
  description: string;
  max: Writable<number> | false;
};

export type ActionType = {
  name: string;
  method: (e: CustomEvent<number>) => void;
  cooltime: {
    max: Writable<number>;
    current: Writable<number>;
  };
  worker: {
    require: Writable<number>;
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

  release(id: string): void;
};

export type ActionManagerType = {
  set(
    id: string,
    actionData: {
      name?: string;
      cooltime: {};
    }
  ): void;
};
