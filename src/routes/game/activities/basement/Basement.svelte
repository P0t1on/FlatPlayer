<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import ActionSlot from './ActionSlot.svelte';
  import { writable, type Writable } from 'svelte/store';
  import './style.scss';

  let items: {
    [key: string]: {
      value: number;
      max: number | false;
    };
  } = {};

  let actions: {
    id: string;
    name: string;
    method: () => void;
    paused: boolean;
    cooltime:
      | false
      | {
          max: number;
          current: Writable<number>;
        };
  }[] = [
    {
      id: 'test1',
      name: '테스트1',
      cooltime: { max: 800, current: writable(0) },
      method: () => {},
      paused: false,
    },
    {
      id: 'test2',
      name: '테스트2',
      cooltime: { max: 400, current: writable(0) },
      method: () => {},
      paused: false,
    },
  ];

  let timeUpdater: NodeJS.Timeout;

  onMount(() => {
    timeUpdater = setInterval(() => {
      for (const { paused, cooltime } of actions) {
        if (!paused && cooltime !== false)
          cooltime.current.update((v) => (v < cooltime.max ? v + 1 : v));
      }
    }, 10);
  });

  onDestroy(() => {
    if (timeUpdater) clearInterval(timeUpdater);
  });
</script>

<section id="basement">
  <ul id="actionList">
    {#each actions as { id, ...args }, i (i)}
      <ActionSlot {...args} />
    {/each}
  </ul>
</section>

<style lang="scss">
  section#basement {
    height: 100%;
    display: flex;

    ul#actionList {
      list-style: none;
      padding: 0;
      border: 2px solid white;

      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
        background-color: transparent;
        outline: solid 2px white;
      }

      &::-webkit-scrollbar-thumb {
        background-color: white;
      }
    }
  }
</style>
