<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
  }>();

  export let title: string,
    description: string,
    canIgnore: boolean,
    zIndex: number,
    onSubmit: () => void;
</script>

<article id="msg"></article>

<style lang="scss" module>
</style>
