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

  update:
    | ((id: string) =>
        | ({
            value: Writable<number>;
          } & ItemType)
        | undefined)
    | (() => { [key: string]: { value: Writable<number> } & ItemType });

  release(id: string): void;

  data: {
    [key: string]: {
      value: Writable<number>;
    } & ItemType;
  };
};

export type ActionManagerType = {
  register(
    id: string,
    actionData: {
      name?: string;
      cooltime: {
        max: number;
        startCooltime?: number;
      };
      requiredWorker?: number;
      method: (worker: number) => void;
    }
  ): ActionType | undefined;

  release(id: string): void;

  update: (id: string) => ActionType | undefined;

  data: { [key: string]: ActionType };
};
