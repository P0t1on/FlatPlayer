import type { ActionManagerType, ItemManagerType } from '$lib/game/Basement';
import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';

export function initOrientation(
  itemManager: ItemManagerType,
  actionManager: ActionManagerType,
  dialogger: DialogManagerType,
  logger: LoggerType
) {
  const actions = actionManager.data;
}
