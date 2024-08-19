<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import DialogBase from '../DialogBase.svelte';
  import SkillSlot from './SkillSlot.svelte';
  import EntitySlot from './EntitySlot.svelte';
  import { Battle } from './Battle';
  import type { EntityTeamType, EntityInstanceType } from '$lib/game/Entity';
  import type { BattleDialogReturnType } from '$lib/game/Dialogs';
  import type { SkillModuleTypes, SkillType } from '$lib/game/Skills';
  import { writable, type Writable } from 'svelte/store';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void, BattleDialogReturnType];
  }>();

  export let zIndex: number, aTeam: EntityTeamType, bTeam: EntityTeamType;

  let selected: EntityInstanceType, battle: Battle;
  const targets: Writable<boolean>[] = Array.from({ length: 10 }, () =>
    writable(true)
  );

  function findTarget(
    user: EntityInstanceType,
    skill?: SkillType<keyof SkillModuleTypes>
  ) {
    return function (param: CustomEvent<boolean>) {
      if (skill === undefined) return;
      if (param.detail) {
      } else {
        for (const t of targets) {
          t.set(false);
        }
      }
    };
  }

  onMount(() => {
    battle = new Battle(aTeam, bTeam);
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
      {#each aTeam as entity, i}
        {#if entity !== undefined}
          <EntitySlot {entity} glow={targets[i]} />
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
              on:hover={findTarget(selected, selected.skillset[0])}
              on:use={() => battle.useSkill(selected, selected.skillset[0])}
            />
            <SkillSlot
              skill={selected.skillset[1]}
              sp={selected.sp.current}
              on:hover={findTarget(selected, selected.skillset[1])}
              on:use={() => battle.useSkill(selected, selected.skillset[1])}
            />
          </div>
          <div>
            <SkillSlot
              skill={selected.skillset[2]}
              sp={selected.sp.current}
              on:hover={findTarget(selected, selected.skillset[2])}
              on:use={() => battle.useSkill(selected, selected.skillset[2])}
            />
            <SkillSlot
              skill={selected.skillset[3]}
              sp={selected.sp.current}
              on:hover={findTarget(selected, selected.skillset[3])}
              on:use={() => battle.useSkill(selected, selected.skillset[3])}
            />
          </div>
        {/if}
      </div>
    </div>
    <div id="b" class="team">
      {#each bTeam as entity, i}
        {#if entity !== undefined}
          <EntitySlot {entity} glow={targets[i + 5]} />
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
