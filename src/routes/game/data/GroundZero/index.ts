import type { ActivityChangerType } from '$lib/game';
import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';
import { createEntity, type EntityType } from '$lib/game/Entity';
import { writable, type Writable } from 'svelte/store';

export async function initOrientation(
  activityChanger: ActivityChangerType,
  dialogManager: DialogManagerType,
  logger: LoggerType,
  gameName: Writable<string>
) {
  const [itemManager, actionManager] = await activityChanger('basement');

  gameName.set('Prologue');

  const lily = createEntity({
      name: 'lily',
      health: 10,
    }),
    enemy = createEntity({
      name: 'dotage',
      health: NaN,
      atk: NaN,
    });

  await dialogManager.show({
    type: 'battle',
    playerTeam: [lily],
    oppoTeam: [enemy],
  });

  await dialogManager.show({
    type: 'messagePage',
    messageList: [
      [
        '???',
        '어서, 이리 와! 더 이상 시간이 없어... 이곳은 이미 너무 위험해졌어. 따라와, 서둘러야 해!',
      ],
      [
        '정체불명의 요정',
        '나는 요정... 음, 내 이름이... 기억나지 않아. 어떻게 여기까지 왔는지는 모르겠지만, 우리는 함께 이곳을 벗어나야 해. 이곳, 아이포투는 한때 내가 지켜야 했던 곳이었어... 아, 잠깐, 그건 지금 중요하지 않아. 지금은 살아남는 게 우선이야. 나는... 어느 순간 여기 있게 되었어. 어떤 강력한 힘이 날 이곳으로 이끌었지. 그 힘은, 분명 신의 것이었지만, 왜 그런 일이 생겼는지, 무슨 의미인지 전혀 기억나지 않아.',
      ],
      [
        '정체불명의 요정',
        '여기서는 누구도 믿을 수 없어. 모든 것이 변했고, 타락한 자들이 곳곳에 있어. 우리는 아주 조심해야 해. 그들이 우리를 찾기 전에 안전한 곳으로 가서 이 세계의 비밀을 찾아야 해. 내 기억 속에 남아 있는 어떤 것이 우리 모두를 구할 열쇠일 거야. 너가 날 도와줄 수 있겠어? 혼자서는... 너무 두려워',
      ],
      ['정체불명의 요정', '앗, 조심해!'],
    ],
    pauseGame: true,
    canIgnore: false,
  });

  await dialogManager.show({
    type: 'messagePage',
    messageList: [
      [
        '정체불명의 요정',
        '아, 아파라... 내 힘이 빠져나가고 있어... 내가 남은 힘을 모아 우리를 안전한 곳으로 워프할게. 준비해!',
      ],
      [
        '정체불명의 요정',
        '이제 우리는 안전해. 이곳은 영점지대(Ground Zero), 피난처야. 여전히 위험이 도사리고 있지만, 새로운 시작을 할 수 있어.\n공격을 받은 이후, 내 능력이 심하게 손상되어 이제는 같은 우주 내의 신이 없는 세계로만 이동할 수 있어. 이 능력을 잘 활용하면, 우리는 희망을 다시 찾을 수 있을 거야.',
      ],
    ],
    pauseGame: true,
    canIgnore: false,
  });

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
    method(w) {
      holyShard.value.update((v) => v + w);
    },
  });
}
