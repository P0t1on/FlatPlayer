<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import DialogBase from '../DialogBase.svelte';
  import SkillSlot from './SkillSlot.svelte';
  import EntitySlot from './EntitySlot.svelte';
  import { Battle } from './Battle';
  import type { EntityTeamType, EntityInstanceType } from '$lib/game/Entity';
  import type { BattleDialogReturnType } from '$lib/game/Dialogs';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void, BattleDialogReturnType];
  }>();

  export let zIndex: number, aTeam: EntityTeamType, bTeam: EntityTeamType;

  let selected: EntityInstanceType;
  let battleSeq: Battle;

  onMount(() => {
    battleSeq = new Battle(aTeam, bTeam);
    selected = aTeam[0];
  });
</script>

<DialogBase
  {...{
    zIndex,
    canIgnore: false,
    overrideContent: true,
    title: aTeam[0].name + ' vs ' + bTeam[0].name,
  }}
  on:destroy={() => dispatch('destroy')}
  on:focus={() => dispatch('focus')}
>
  <div id="contents" slot="content">
    <div id="a" class="team">
      {#each aTeam as entity}
        {#if entity !== undefined}
          <EntitySlot {entity} />
        {/if}
      {/each}
    </div>
    <div id="interactions">
      <div id="stage"></div>
      <div id="skillslot">
        {#if selected !== undefined}
          <div>
            <SkillSlot
              skill={selected.skillset[0]}
              sp={selected.sp.current}
              on:hover={(v) => console.log(v)}
            />
            <SkillSlot skill={selected.skillset[1]} sp={selected.sp.current} />
          </div>
          <div>
            <SkillSlot skill={selected.skillset[2]} sp={selected.sp.current} />
            <SkillSlot skill={selected.skillset[3]} sp={selected.sp.current} />
          </div>
        {/if}
      </div>
    </div>
    <div id="b" class="team">
      {#each bTeam as entity}
        {#if entity !== undefined}
          <EntitySlot {entity} />
        {/if}
      {/each}
    </div>
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

      border: 1px solid white;

      div#skillslot {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 8px 0 8px 0;

        div {
          display: flex;
          justify-content: center;
          padding: 0 8px 0 8px;
          width: min-content;
        }
      }
    }
  }
</style>
