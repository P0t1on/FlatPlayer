<script lang="ts">
  import { onMount } from 'svelte';
  import Adventure from './activities/adventure/Adventure.svelte';
  import Basement from './activities/basement/Basement.svelte';
  import Logger from './Logger.svelte';
  import type { LoggerType } from '$lib/game/basement';

  const comps = {
    basement: Basement,
    adventure: Adventure,
  };
  let gameName = '';
  let component: keyof typeof comps = 'basement',
    logger: LoggerType;

  onMount(() => {
    logger.log('tester', 'hello, world!');
    logger.log('tester', 'hello, world!');
    logger.log('tester', 'hello, world!');
  });
</script>

<svelte:head>
  <title>{gameName} - {component}</title>
</svelte:head>

<section>
  <svelte:component this={comps[component]} />
  <Logger bind:logger />
</section>

<style lang="scss">
  :global(body) {
    overflow-y: hidden;
  }
</style>
