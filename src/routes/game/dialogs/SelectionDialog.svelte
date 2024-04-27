<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void, number];
  }>();

  export let title: string, description: string, zIndex: number, menu: string[];
</script>

<article id="selection"></article>

<style lang="scss" module>
  article#selection {
    display: flex;
  }
</style>
