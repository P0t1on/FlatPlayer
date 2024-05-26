import type { ActionManagerType, ItemManagerType } from './Basement';

export type ActivityNames = 'basement' | 'adventure';

export type ActivityChangerMethodType = {
  adventure: Promise<number>;
  basement: Promise<[ItemManagerType, ActionManagerType]>;
};

export type ActivityChangerType = <T extends keyof ActivityChangerMethodType>(
  name: T
) => ActivityChangerMethodType[T];
