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
  <div id="contents" slot="content">
    <div id="a" class="team">teamA</div>
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
    <div id="b" class="team">teamB</div>
  </div>
</DialogBase>

<style lang="scss" module>
  div#contents {
    display: flex;
    flex-direction: row;

    div.team {
      padding: 4px;
    }

    div#interactions {
      display: flex;
      flex-direction: column;
      align-items: center;

      width: 100%;
      border: 1px solid white;

      div#skillslot {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 4px;

        div {
          display: flex;
          align-items: center;
          padding: 0 4px 0 4px;
          width: 100%;
        }
      }
    }
  }
</style>
