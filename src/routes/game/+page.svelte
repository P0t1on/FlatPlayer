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
  import { get, writable, type Writable } from 'svelte/store';

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

  onMount(() => {
    initOrientation(activityChanger, dialogManager, logger, gameName);

    function startSpawnStar(
      next: typeof startSpawnStar,
      origin?: HTMLDivElement,
      closer?: Writable<boolean>
    ) {
      if (closer === undefined) closer = writable(false);
      else if (get(closer) === true) {
        if (origin !== undefined) {
          root.removeChild(origin);
          origin.remove();
        }
        return () => console.debug('이미 종료된 대상입니다.');
      }

      let starElement: HTMLDivElement;
      if (origin === undefined) {
        starElement = document.createElement('div');

        starElement.classList.add('star');
        root.append(starElement);
      } else starElement = origin;

      const delay = Math.random() * 2,
        repeat = Math.floor(Math.random() * (3 - 1) + 1);

      starElement.innerText = getStarEmoji();
      starElement.style.top = Math.random() * 100 + '%';
      starElement.style.left = Math.random() * 100 + '%';
      starElement.style.animation = `twinkle ${delay * 2}s infinite`;

      setTimeout(
        () => {
          next(next, starElement, closer);
        },
        delay * 2000 * repeat
      );

      return () => closer.set(true);
    }

    for (let i = 0; i < 10; i++) {
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
      user-select: none;
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
