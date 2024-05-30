import type { ActivityChangerType } from '$lib/game';
import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';

export async function initOrientation(
  activityChanger: ActivityChangerType,
  dialogManager: DialogManagerType,
  logger: LoggerType
) {
  const [itemManager, actionManager] = await activityChanger('basement');

  const holyShard = itemManager.set('holy-shard', 0, {
    name: '빛나는 파편',
    description: '희미하게 빛나는 돌이다.',
    max: false,
  });

  actionManager.register('test', {
    name: '테스트 액션',
    cooltime: {
      max: 400,
    },
    method: (w) => {
      holyShard.value.update((v) => v + w);
    },
  });

  dialogManager.show({
    type: 'message',
    pauseGame: true,
  });
}
