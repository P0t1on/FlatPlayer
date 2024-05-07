<script lang="ts">
  import { onMount } from 'svelte';
  import Adventure from './activities/adventure/Adventure.svelte';
  import Basement from './activities/basement/Basement.svelte';
  import Logger from './Logger.svelte';
  import DialogManager from './dialogs/DialogManager.svelte';
  import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';

  const comps = {
    basement: Basement,
    adventure: Adventure,
  };

  const onPause = (e: CustomEvent<boolean>) => {};

  let gameName = '';
  let component: keyof typeof comps = 'basement',
    logger: LoggerType,
    dialogManager: DialogManagerType;

  onMount(() => {
    logger.log('tester', 'hello, world!');
    logger.log('tester', 'hello, world!');
    logger.log('tester', 'hello, world!');

    const menu = ['test1', 'a', 'b', 'c', '321'];
    dialogManager.show({
      type: 'selection',
      title: 'test',
      description: '설명',
      canIgnore: true,
      menu,
      onSubmit(preventDefault, i) {
        preventDefault();
        console.log(menu[i]);
      },
    });

    dialogManager.show({
      type: 'message',
      title: 'te',
      description: 'yeeeeeee',
      onSubmit() {
        console.log('yee');
      },
    });
  });
</script>

<svelte:head>
  <title>{gameName} - {component}</title>
</svelte:head>

<section>
  <svelte:component this={comps[component]} />
  <Logger bind:logger />
  <DialogManager bind:manager={dialogManager} on:pause={onPause} />
</section>

<style lang="scss">
  :global(body) {
    overflow-x: hidden;
    overflow-y: hidden;
  }
</style>
