<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
  }>();

  export let title: string,
    description: string,
    zIndex: number,
    menu: string[],
    onSubmit: (selected: number) => void;
</script>

<article id="selection"></article>

<style lang="scss" module>
  article#selection {
    display: flex;
  }
</style>
