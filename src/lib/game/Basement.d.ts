import type { Writable } from 'svelte/store';

export type ItemType = {
  name: Writable<string>;
  description: Writable<string>;
  max: Writable<number> | false;
  value: Writable<number>;
};

export type ItemCollectionType = {
  [key: string]: ItemType;
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
  ): ItemType;

  update(id: string): ItemType | undefined;

  updateAll(): ItemCollectionType;

  release(id: string): ItemType | undefined;

  getData(): ItemCollectionType;
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

export type ActionCollectionType = { [key: string]: ActionType };

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

  release(id: string): ActionType | undefined;

  update(id: string): ActionType | undefined;

  updateAll(): ActionCollectionType;

  getData(): ActionCollectionType;
};
