<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import ActionSlot from './ActionSlot.svelte';
  import './style.scss';
  import { writable, type Writable } from 'svelte/store';

  let items: {
    [key: string]: {
      value: number;
      max: number | false;
    };
  } = {};

  let actions: {
    id: string;
    name: string;
    cooltime: number | false;
    method: () => void;
    currentCooltime: Writable<number>;
    paused: boolean;
  }[] = [
    {
      id: 'test1',
      name: '테스트1',
      cooltime: 50,
      method: () => {},
      currentCooltime: writable(0),
      paused: false,
    },
    {
      id: 'test2',
      name: '테스트2',
      cooltime: 30,
      method: () => {},
      currentCooltime: writable(0),
      paused: false,
    },
  ];

  let timeUpdater: NodeJS.Timeout;

  onMount(() => {
    timeUpdater = setInterval(() => {
      for (const { paused, cooltime, currentCooltime } of actions) {
        if (!paused && cooltime !== false)
          currentCooltime.update((v) => (v < cooltime ? v + 1 : v));
      }
    }, 100);
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
