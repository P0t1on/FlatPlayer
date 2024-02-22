<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import SkillSlot from './SkillSlot.svelte';

  // props
  export let width = '100px',
    height = '100px',
    borderColor = 'cyan';
  export let name1 = 'Actor1',
    hpColor1 = 'red';
  export let name2 = 'Actor2',
    hpColor2 = 'green';

  // bindings
  export let hpProgress = writable(50),
    skillSlots: [[any, any, any], [any, any, any], [any, any, any]];

  // element bind
  let actions: HTMLDivElement;

  // styles
  let hpP1: string, hpP2: string;
  hpProgress.subscribe((v) => {
    hpP1 = `${v}%`;
    hpP2 = `${100 - v}%`;
  });

  const dispatch = createEventDispatcher();

  onMount(() => {
    const createSlot = (index: number) =>
      new SkillSlot({ props: { index }, target: actions });

    skillSlots = [
      [createSlot(1), createSlot(2), createSlot(3)],
      [createSlot(4), createSlot(5), createSlot(6)],
      [createSlot(7), createSlot(8), createSlot(9)],
    ];
  });
</script>

<article id="battle">
  <slot name="health">
    <div id="health">
      <div class="hp hp1">{name1}</div>
      <div class="hp hp2">{name2}</div>
    </div>
  </slot>
  <div id="field"></div>
  <slot name="actions">
    <div id="actions" bind:this={actions}></div>
  </slot>
  <div id="etc">
    <div id="specials"></div>
    <div id="consumes"></div>
  </div>
</article>

<style module lang="scss">
  $borderColor: bind(borderColor);

  article#battle {
    & {
      display: flex;
      flex-direction: column;
      position: absolute;

      z-index: 2;
      width: bind(width);
      height: bind(height);

      color: white;
      background-color: black;
      border: 1px solid $borderColor;
    }
    div {
      &#health {
        & {
          height: 3.5%;

          border-bottom: 1px solid #6fc3df;
          display: flex;
          flex-direction: row;
        }

        div.hp {
          padding: 0 4px 0 4px;
          border: none;
          font-size: small;
        }

        .hp1 {
          width: bind(hpP1);
          background-color: bind(hpColor1);
        }

        .hp2 {
          width: bind(hpP2);
          background-color: bind(hpColor2);
          text-align: right;
        }
      }

      &#field {
        height: 25%;
        border-bottom: 1px solid $borderColor;
      }

      &#actions {
        height: 32.5%;
        border-bottom: 1px solid $borderColor;
      }

      &#etc {
        height: 39%;

        display: flex;
        flex-direction: row;

        div {
          width: 50%;

          &#specials {
            border-right: 1px solid $borderColor;
          }
        }
      }
    }
  }
</style>
