<script lang="ts">
  import { onMount } from 'svelte';
  import { initOrientation } from './data/Orientation';
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

  let gameName = '';
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

  onMount(() => {
    initOrientation(activityChanger, dialogManager, logger);
  });
</script>

<svelte:head>
  <title>{gameName} - {activity}</title>
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
    overflow-x: hidden;
    overflow-y: hidden;
  }

  section {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
  }
</style>
