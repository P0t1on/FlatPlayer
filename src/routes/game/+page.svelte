<script lang="ts">
  import { onMount } from 'svelte';
  import { initOrientation } from './data/Orientation';
  import Adventure from './activities/adventure/Adventure.svelte';
  import Basement from './activities/basement/Basement.svelte';
  import Logger from './Logger.svelte';
  import DialogManager from './dialogs/DialogManager.svelte';
  import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';
  import type { ActionManagerType, ItemManagerType } from '$lib/game/Basement';
  import type { ActivityNames } from '$lib/game';

  let gameName = '';
  let component: ActivityNames,
    logger: LoggerType,
    dialogManager: DialogManagerType;
  component = 'basement';

  function onPause(e: CustomEvent<boolean>) {}

  function activityChanger(comp: ActivityNames) {
    component = comp;
  }

  // Basement variables
  let itemManager: ItemManagerType, actionManager: ActionManagerType;

  onMount(() => {
    initOrientation(
      activityChanger,
      itemManager,
      actionManager,
      dialogManager,
      logger
    );
  });
</script>

<svelte:head>
  <title>{gameName} - {component}</title>
</svelte:head>

<section>
  {#if component === 'basement'}
    <Basement bind:itemManager bind:actionManager />
  {:else if component === 'adventure'}
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
