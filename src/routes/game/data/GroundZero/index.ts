import type { ActivityChangerType } from '$lib/game';
import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';
import { Entity } from '$lib/game/Entity';
import skills from './SkillDefinitions';
import { type Writable } from 'svelte/store';

export async function initOrientation(
  activityChanger: ActivityChangerType,
  dialogManager: DialogManagerType,
  logger: LoggerType,
  gameName: Writable<string>
) {
  const [itemManager, actionManager] = await activityChanger('basement');

  gameName.set('Prologue');

  const lily = new Entity('릴리', '용사', {}, [
      skills['hit_down'],
      skills['run_run_run'],
      skills['enforce_sense'],
    ]),
    dotage = new Entity(
      '망령',
      '성력에 잡아먹혀 이지를 상실하고 괴물로 전락한 거주민',
      {
        atk: NaN,
        hp: NaN,
        sp: 10,
      },
      [skills['chase'], skills['strage_fear']]
    );

  await dialogManager.show({
    type: 'battle',
    playerTeam: [
      lily.instantiate({
        hp: 5,
        sp: 5,
      }),
    ],
    oppoTeam: [dotage.instantiate({ level: NaN })],
  });

  const stellarShard = itemManager.set('stellar-shard', 0, {
    name: '빛나는 파편',
    description: '희미하게 빛나는 돌이다.',
    max: false,
  });

  actionManager.register('test', {
    name: '테스트 액션',
    cooltime: {
      max: 400,
    },
    method(w) {
      stellarShard.value.update((v) => v + w);
    },
  });
}
