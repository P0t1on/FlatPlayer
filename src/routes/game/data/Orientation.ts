import type { ActivityChangerType } from '$lib/game';
import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';

export function initOrientation(
  activityChanger: ActivityChangerType,
  dialogger: DialogManagerType,
  logger: LoggerType
) {
  activityChanger('basement');
}
