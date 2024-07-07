<script lang="ts">
  import { onMount } from 'svelte';
  import { initOrientation } from './data/GroundZero/index';
  import Adventure from './activities/adventure/Adventure.svelte';
  import Basement from './activities/basement/Basement.svelte';
  import Logger from './Logger.svelte';
  import DialogManager from './dialogs/DialogManager.svelte';
  import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';
  import type { ActionManagerType, ItemManagerType } from '$lib/game/Basement';
  import type {
    ActivityChangerMethodType,
    ActivityChangerType,
    ActivityNames,
  } from '$lib/game';
  import { writable } from 'svelte/store';

  let gameName = writable('Preparing...');
  let activity: ActivityNames,
    logger: LoggerType,
    dialogManager: DialogManagerType;

  let root: HTMLElement;

  const loaders: {
      basement?: (managers: [ItemManagerType, ActionManagerType]) => void;
      adventure?: (value: number) => void;
    } = {},
    activityChangerMethod: ActivityChangerMethodType = {
      adventure: new Promise<number>((res, rej) => {}),
      basement: new Promise<[ItemManagerType, ActionManagerType]>(
        (res, rej) => {}
      ),
    },
    activityChanger: ActivityChangerType = (name) => {
      console.debug(`loading Activity : ${name}`);
      activity = name;

      // TODO 일단 ts-ignore로 임시조치해뒀지만 여기도 ignore없이 구현할 방법 찾아야됨...
      // @ts-ignore
      activityChangerMethod[name] = new Promise((res) => {
        loaders[name] = res;
      });

      return activityChangerMethod[name];
    };

  // Game Logic
  let pauseLevel = writable(0);

  // 발광하는 별의 배경화면

  const starEmojiList = ['⭐', '🌟', '✨', '🌠', '🌌', '💫', '🎇'];
  function getStarEmoji() {
    return starEmojiList[
      Math.floor(Math.random() * starEmojiList.length)
    ] as string;
  }
  let stars = new Set<HTMLDivElement>();

  onMount(() => {
    initOrientation(activityChanger, dialogManager, logger, gameName);

    function startSpawnStar(next: typeof startSpawnStar) {
      const starElement = document.createElement('div'),
        delay = Math.random() * 2,
        repeat = Math.floor(Math.random() * (3 - 1) + 1);

      starElement.classList.add('star');
      starElement.innerText = getStarEmoji();
      starElement.style.top = Math.random() * 100 + '%';
      starElement.style.left = Math.random() * 100 + '%';
      starElement.style.animation = `twinkle ${delay * 2}s infinite`;

      root.append(starElement);
      stars.add(starElement);

      setTimeout(
        () => {
          root.removeChild(starElement);
          starElement.remove();
          stars.delete(starElement);

          next(next);
        },
        delay * 2000 * repeat
      );
    }

    for (let i = 0; i < 50; i++) {
      startSpawnStar(startSpawnStar);
    }
  });
</script>

<svelte:head>
  <title>Flat Player [{$gameName}]</title>
</svelte:head>

<section bind:this={root}>
  {#if activity === 'basement'}
    <Basement
      on:load={({ detail }) => {
        loaders.basement?.(detail);
      }}
      {pauseLevel}
    />
  {:else if activity === 'adventure'}
    <Adventure />
  {/if}
  <Logger bind:logger />
  <DialogManager managerDiv={root} bind:manager={dialogManager} {pauseLevel} />
</section>

<style lang="scss">
  :global(body) {
    overflow: hidden;
  }

  section {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;

    :global(.star) {
      position: absolute;
      width: 2px;
      height: 2px;
      border-radius: 50%;
    }
  }

  @keyframes -global-twinkle {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 0.8;
    }
  }
</style>
