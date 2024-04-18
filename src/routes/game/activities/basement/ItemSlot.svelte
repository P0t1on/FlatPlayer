<script lang="ts">
  import type { Writable } from 'svelte/store';

  export let value: Writable<number>,
    name: string,
    description: string,
    max: number | false;
</script>

{#if max === false}
  <li>{name}: {$value}</li>
{:else}
  <li></li>
{/if}

<style lang="scss" module>
  li {
    color: white;
  }
</style>
