<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { get } from 'svelte/store';
  import DialogBase from '../DialogBase.svelte';
  import SkillSlot from './SkillSlot.svelte';
  import type { EntityTeamType, EntityType } from '$lib/game/Entity';
  import type { BattleDialogReturnType } from '$lib/game/Dialogs';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void, BattleDialogReturnType];
  }>();

  export let zIndex: number,
    playerSlot: EntityTeamType,
    opponentSlot: EntityTeamType;

  let selected: EntityType;

  const title = get(playerSlot[0].name) + ' vs ' + get(opponentSlot[0].name);

  onMount(() => {
    selected = playerSlot[0];
  });
</script>

<DialogBase
  {...{ zIndex, canIgnore: false, overrideContent: true, title }}
  on:destroy={() => dispatch('destroy')}
  on:focus={() => dispatch('focus')}
>
  <div id="board" slot="content">
    <div id="a" class="team"></div>
    <div id="interactions">
      <div id="stage"></div>
      <div id="skillslot">
        <div>
          <SkillSlot />
          <SkillSlot />
        </div>
        <div>
          <SkillSlot />
          <SkillSlot />
        </div>
      </div>
    </div>
    <div id="b" class="team"></div>
  </div>
</DialogBase>

<style lang="scss" module>
  div#board {
    display: flex;

    div#interactions {
      display: flex;

      border: 1px solid white;

      div#skillslot {
        display: flex;
        div {
          display: flex;
        }
      }
    }
  }
</style>
