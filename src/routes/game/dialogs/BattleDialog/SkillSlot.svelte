<script lang="ts">
  import type { SkillType, SkillModuleTypes } from '$lib/game/Skills';
  import { createEventDispatcher } from 'svelte';
  import type { Writable } from 'svelte/store';

  let dispatch = createEventDispatcher<{
    use: void;
    hover: boolean;
  }>();

  export let skill: SkillType<keyof SkillModuleTypes> | undefined = undefined,
    available = true,
    sp: Writable<number>;

  let button: HTMLButtonElement;
</script>

<button
  class:available={skill !== undefined && available && $sp >= skill.cost}
  class:disabled={skill === undefined}
  class:atk={skill?.type === 'attack'}
  class:buf={skill?.type === 'buff'}
  class:def={skill?.type === 'defense'}
  class:etc={skill?.type === 'etc'}
  class="skillSlot"
  bind:this={button}
  on:click={() => dispatch('use')}
  on:mouseenter={() => dispatch('hover', true)}
  on:mouseleave={() => dispatch('hover', false)}
>
  {#if skill !== undefined}
    {skill.name}
  {/if}
</button>

<style lang="scss" module>
  button.skillSlot {
    justify-content: center;
    width: 100px;
    height: 50px;
    margin: 4px;
    padding: 6px;

    background-color: black;
    color: white;
    font-family: 'Noto Sans KR';
    font-size: medium;
    border: 4px outset white;
    border-radius: 5px;
    opacity: 60%;

    transition: all ease 0.2s;

    &.atk {
      background-color: crimson;
    }

    &.def {
      background-color: cadetblue;
    }

    &.buf {
      background-color: rgba(150, 255, 255);
    }

    &.etc {
      background-color: slateblue;
    }

    &.available {
      opacity: 80%;
      cursor: pointer;
      &:hover {
        opacity: 100%;

        &:active {
          opacity: 80%;
          border: 4px inset white;
        }
      }
    }

    &.disabled {
      cursor: auto;
      background-color: transparent;
      border: none;

      &:hover:active {
        border: none;
      }
    }
  }
</style>
