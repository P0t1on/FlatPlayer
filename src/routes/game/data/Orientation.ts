import type { ActivityNames } from '$lib/game';
import type { ActionManagerType, ItemManagerType } from '$lib/game/Basement';
import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';

export function initOrientation(
  activityChanger: (activity: ActivityNames) => void,
  itemManager: ItemManagerType,
  actionManager: ActionManagerType,
  dialogger: DialogManagerType,
  logger: LoggerType
) {
  const actions = actionManager.data;
}
