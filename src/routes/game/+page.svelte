<script lang="ts">
  import { onMount } from 'svelte';
  import Adventure from './activities/adventure/Adventure.svelte';
  import Basement from './activities/basement/Basement.svelte';
  import Logger from './Logger.svelte';

  import './style.scss';

  const comps = {
    basement: Basement,
    adventure: Adventure,
  };
  let gameName = '';
  let component: keyof typeof comps = 'basement';

  onMount(() => {});
</script>

<svelte:head>
  <title>{gameName} - {component}</title>
</svelte:head>

<section>
  <svelte:component this={comps[component]} />
  <Logger />
</section>

<style lang="scss">
  :global(body) {
    overflow-y: hidden;
  }
</style>
