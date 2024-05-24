import type { ActionManagerType, ItemManagerType } from '$lib/game/Basement';
import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';

export function initOrientation(
  itemManager: ItemManagerType,
  actionManager: ActionManagerType,
  dialogger: DialogManagerType,
  logger: LoggerType
) {
  const actions = actionManager.data;

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
}
