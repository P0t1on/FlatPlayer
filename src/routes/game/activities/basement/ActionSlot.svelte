<script lang="ts">
  import { onMount } from 'svelte';
  import { get, type Writable } from 'svelte/store';

  export let name: string,
    cooltime:
      | false
      | {
          max: number;
          current: Writable<number>;
        },
    method: () => void,
    paused: boolean;
  let main: HTMLLIElement;
  // classList
  let ready = false;

  const onClick = () => {
    if (cooltime !== false) {
      const { current, max } = cooltime;

      if (get(current) >= max) {
        current.set(0);
        method();
      }
    } else method();
  };

  //
  let fill: string, slot1Style: string;

  onMount(() => {
    if (cooltime !== false) {
      const max = cooltime.max;

      cooltime.current.subscribe((v) => {
        fill = `${(100 * v) / max}%`;
        if (main) {
          if (v >= max) {
            ready = true;
          } else {
            ready = false;
          }
        }
      });
    } else if (main) {
      ready = true;
    }
  });
</script>

{#if cooltime !== false}
  <li
    class:ready
    class:clickable={ready}
    class="actionSlot s1"
    style={slot1Style}
    on:click={onClick}
    on:keydown
    role="presentation"
    bind:this={main}
  >
    <span>{name}</span>
  </li>
{:else}
  <li
    class:clickable={ready}
    class="actionSlot s2"
    on:click={onClick}
    on:keydown
    role="presentation"
    bind:this={main}
  >
    <span>{name}</span>
  </li>
{/if}

<style lang="scss" module>
  @keyframes -global-ActionSlot_hoverAnim {
    0% {
      box-shadow: inset 0 0 0 0 white;
    }

    100% {
      box-shadow: inset 0 0 10px 5px gray;
    }
  }
  li.actionSlot {
    &.s1 {
      background: linear-gradient(
        to right,
        white 0 bind(fill),
        black bind(fill) 100%
      );

      &.ready:hover {
        animation-name: ActionSlot_hoverAnim;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        border: solid 2px gray;
      }
    }

    &.s2 {
      background-color: white;
      cursor: pointer;
      &.ready:hover {
        animation-name: actionAnim;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        border: solid 2px gray;
      }
    }

    margin: 12px;
    padding: 8px;
    mix-blend-mode: difference;
    font-weight: bold;
    font-size: larger;
    user-select: none;
    border: solid 2px white;

    span {
      mix-blend-mode: difference;
      color: white;
    }
  }
</style>
