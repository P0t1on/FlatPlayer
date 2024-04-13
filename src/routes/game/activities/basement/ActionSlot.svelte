<script lang="ts">
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let name: string,
    cooltime:
      | false
      | {
          max: number;
          current: Writable<number>;
        },
    method: () => void;

  const onClick = () => {
    if (cooltime !== false) {
      const { current, max } = cooltime;

      if ($current >= max) {
        current.set(0);
        method();
      }
    } else method();
  };

  let fill: string;

  onMount(() => {
    if (cooltime !== false) {
      cooltime.current.subscribe((v) => {
        fill = cooltime !== false ? `${(100 * v) / cooltime.max}%` : '100%';
      });
    }
  });
</script>

{#if cooltime !== false}
  <li
    class="actionSlot1"
    style={`${cooltime !== false ? 'cursor: pointer;' : ''}`}
  >
    <span>{name} - {($currentCooltime / 100).toFixed(0)}</span>
  </li>
{:else}
  <li class="actionSlot2" on:click={onClick} on:keydown role="presentation">
    <span>{name}</span>
  </li>
{/if}

<style lang="scss" module>
  li.actionSlot {
    &1 {
      background: linear-gradient(
        to right,
        white 0 bind(fill),
        black bind(fill) 100%
      );
    }
    &2 {
      background-color: white;
      cursor: pointer;
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
