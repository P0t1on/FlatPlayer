<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import DialogBase from './DialogBase.svelte';
  import type { EntityTeamType } from '$lib/game/EntityTypes';
  import type { BattleDialogReturnType } from '$lib/game/Dialogs';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void, BattleDialogReturnType];
  }>();

  export let zIndex: number,
    playerSlot: EntityTeamType,
    opponentSlot: EntityTeamType;

  const title = playerSlot[0].name + ' vs ' + opponentSlot[0].name;

  onMount(() => {});
</script>

<DialogBase
  {...{ zIndex, canIgnore: false, overrideContent: true, title }}
  on:destroy={() => dispatch('destroy')}
  on:focus={() => dispatch('focus')}
></DialogBase>

<style lang="scss" module>
</style>
