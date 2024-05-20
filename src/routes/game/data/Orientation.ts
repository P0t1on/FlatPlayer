import type { ActionType, ItemManagerType, ItemType } from '$lib/game/Basement';
import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';
import type { Writable } from 'svelte/store';

export function initOrientation(
  items: {
    [key: string]: { value: Writable<number> } & ItemType;
  },
  actions: ActionType[],
  itemManager: ItemManagerType,
  dialogger: DialogManagerType,
  logger: LoggerType
) {}
