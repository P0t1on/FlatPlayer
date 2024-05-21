import type {
  ActionManagerType,
  ActionType,
  ItemManagerType,
  ItemType,
} from '$lib/game/Basement';
import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';
import { writable, type Writable } from 'svelte/store';

export function initOrientation(
  items: {
    [key: string]: { value: Writable<number> } & ItemType;
  },
  actions: { [key: string]: ActionType },
  itemManager: ItemManagerType,
  actionManager: ActionManagerType,
  dialogger: DialogManagerType,
  logger: LoggerType
) {
  itemManager.set('test', 0, {
    name: '테스트자원',
    description: '테스트',
  });

  actionManager.register('test', {
    name: '테스트 액션',
    cooltime: {
      max: 200,
    },
    method: (w) => itemManager.change('test', (v) => v + w),
  });

  console.log(actions);

  actionManager.release('test1');
}
