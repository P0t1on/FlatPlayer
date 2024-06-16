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

  await dialogManager.show({
    type: 'messagePage',
    messageList: [
      [
        '???',
        '어서, 이리 와요! 더 이상 시간이 없어요... 이곳은 이미 너무 위험해졌어요. 따라와 주세요, 서둘러야 해요!',
      ],
      [
        '요정 ???',
        '저는 요정... 음, 제 이름이... 기억나지 않아요. 어떻게 여기까지 왔는지는 모르겠지만, 우리는 함께 이곳을 벗어나야 해요. 이곳, 아이포투는 한때 제가 지켜야 했던 곳이었어요... 아, 잠깐, 그건 지금 중요하지 않아요. 지금은 살아남는 게 우선이에요.\n저는... 어느 순간 여기 있게 되었어요. 어떤 강력한 힘이 저를 이곳으로 이끌었죠. 그 힘은, 분명 신의 것이었어요... 하지만 왜 그런 일이 생겼는지, 무슨 의미인지 전혀 기억나지 않아요.\n여기서는 누구도 믿을 수 없어요. 모든 것이 변했고, 타락한 자들이 곳곳에 있어요. 우리는 아주 조심해야 해요. 그들이 우리를 찾기 전에 안전한 곳으로 가야 해요.\n이 세계의 비밀을 찾아야 해요. 제 기억 속에 남아 있는 어떤 것이 우리 모두를 구할 열쇠일 거예요. 당신이 저를 도와줄 수 있나요? 혼자서는... 너무 두려워요.',
      ],
    ],
    pauseGame: true,
    canIgnore: false,
  });

  await dialogManager.show({
    type: 'messagePage',
    messageList: [
      [
        '요정 ???',
        '갑자기 강력한 타락한 존재가 나타났어요! 빨리 숨을 곳을 찾아야 해요! 제가... 이동 능력을 사용할게요. 이 세계에서는 더 이상 안전하지 않아요. 우리 같은 우주 내의 신이 없는 세계로 이동해야 해요. 준비하세요!',
      ],
      [
        '요정 ???',
        '이제 안전해요. 여기는 세계 영점지대의 주인 없는 피난처예요. 아직 위험은 도사리고 있지만, 여기서 다시 시작할 수 있어요. 원래는 모든 세계를 자유롭게 이동할 수 있었는데, 이제는 힘이 약해져서 같은 우주 내의 신이 없는 세계로만 이동할 수 있어요. 이 능력을 잘 활용하면, 우리는 다시 희망을 찾을 수 있을 거예요.',
      ],
    ],
    pauseGame: true,
    canIgnore: false,
  });

  const [test] = (await dialogManager.show({
    type: 'selection',
    title: '',
    description: '',
    menu: ['2', '43'],
    onSubmit(preventDefault, selected) {
      preventDefault();
      console.log(selected);
    },
    canIgnore: false,
    pauseGame: true,
  })) as [number];

  console.log(test);

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
