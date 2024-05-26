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

  let gameName = '';
  let activity: ActivityNames,
    logger: LoggerType,
    dialogManager: DialogManagerType;

  const loaders = {
      basement: (managers: [ItemManagerType, ActionManagerType]) => {},
      adventure: (value: number) => {},
    },
    activityChangerMethod: ActivityChangerMethodType = {
      adventure: new Promise<number>((res, rej) => {}),
      basement: new Promise<[ItemManagerType, ActionManagerType]>(
        (res, rej) => {}
      ),
    },
    activityChanger: ActivityChangerType = (name) => {
      console.debug(`loading Activity : ${name}`);
      activity = name;

      // @ts-ignore
      activityChangerMethod[name] = new Promise((res) => {
        loaders[name] = res;
      });

      return activityChangerMethod[name];
    };

  function onPause(e: CustomEvent<boolean>) {}

  onMount(() => {
    initOrientation(activityChanger, dialogManager, logger);
  });
</script>

<svelte:head>
  <title>{gameName} - {activity}</title>
</svelte:head>

<section>
  {#if activity === 'basement'}
    <Basement
      on:load={({ detail }) => {
        loaders.basement(detail);
      }}
    />
  {:else if activity === 'adventure'}
    <Adventure />
  {/if}
  <Logger bind:logger />
  <DialogManager bind:manager={dialogManager} on:pause={onPause} />
</section>

<style lang="scss">
  :global(body) {
    overflow-x: hidden;
    overflow-y: hidden;
  }
</style>
