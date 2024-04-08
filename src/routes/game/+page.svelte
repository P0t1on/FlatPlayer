<script lang="ts">
  import { onMount, type ComponentType } from 'svelte';
  import Adventure from './activities/adventure/Adventure.svelte';
  import Basement from './activities/basement/Basement.svelte';

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

<svelte:component this={comps[component]} />

<style lang="scss">
</style>
