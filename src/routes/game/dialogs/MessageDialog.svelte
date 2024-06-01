<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import DialogBase from './DialogBase.svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void];
  }>();

  export let title: string | false,
    description: string,
    zIndex: number,
    canIgnore: boolean;
</script>

<DialogBase
  {...{ title, description, zIndex, canIgnore }}
  on:destroy={() => dispatch('destroy')}
  on:focus={() => dispatch('focus')}
  on:submit={(e) => dispatch('submit', e.detail)}
></DialogBase>

<style lang="scss" module>
</style>
