<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import DialogBase from './DialogBase.svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void];
  }>();

  export let title: string, description: string, zIndex: number;
</script>

<DialogBase
  {...{ title, description, zIndex }}
  on:destroy={() => dispatch('destroy')}
  on:focus={() => dispatch('focus')}
  on:submit={(e) => dispatch('submit', e.detail)}
>
</DialogBase>

<style lang="scss" module>
</style>
