import type { ActivityChangerType } from '$lib/game';
import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';
import type { Writable } from 'svelte/store';

export async function initOrientation(
  activityChanger: ActivityChangerType,
  dialogManager: DialogManagerType,
  logger: LoggerType,
  gameName: Writable<string>
) {
  const [itemManager, actionManager] = await activityChanger('basement');

  gameName.set('Prologue');

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

  await dialogManager.show({
    type: 'messagePage',
    messageList: [
      [
        '???',
        '어서, 이리 와요! 더 이상 시간이 없어요... 이곳은 이미 너무 위험해졌어요. 따라와 주세요, 서둘러야 해요!',
      ],
      [
        '요정 ???',
        '저는 요정 ▩▩▩예요. 여길 어떻게 찾아왔는지 모르겠지만, 우리는 같은 길을 가야 해요. 이곳, 아이포투는 한때 제가 지켜야 했던... 아, 잠깐, 이건 중요한 게 아니에요. 중요한 건 지금 여기서 살아남는 것이죠.',
      ],
      [
        '요정 ???',
        '저는... 저도 모르게 여기에 있게 됐어요. 어떤 큰 힘이 저를 여기로 이끌었어요. 그 힘은, 분명 신의 것이었죠... 하지만 무엇을 의미하는지, 왜 나에게 이런 일이 생긴 건지는... 기억나지 않아요.',
      ],
      [
        '요정 ???',
        '여기는 누구도 신뢰할 수 없어요. 모든 것이 변했고, 타락한 자들이 어디에나 있어요. 우리는 조심해야 해요. 그들이 우리를 찾기 전에, 우리가 먼저 안전한 곳으로 가야 해요.',
      ],
      [
        '요정 ???',
        '저는 이 세계의 비밀을 찾아야 해요. 제 기억 속에 있는 무언가가 우리 모두를 구할 수 있는 열쇠일 거예요. 혹시 도와줄 수 있나요? 저 혼자는... 두렵네요.',
      ],
    ],
    pauseGame: true,
    canIgnore: false,
  });
}
