<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import ActionSlot from './ActionSlot.svelte';
  import ItemSlot from './ItemSlot.svelte';

  type ItemType = {
    name: string;
    description: string;
    max: number | false;
  };

  const items: {
    [key: string]: {
      value: Writable<number>;
    } & ItemType;
  } = {
    rog:{
      name: "Rog item",
      description: "test desc",
      max: false,
      value: writable(3)
    }
  };

  const actions: {
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
      method: () => {
        itemManager.change('rog', v => v+1)
      },
      paused: false,
    },
  ];

  let timeUpdater: NodeJS.Timeout;
  const itemManager = {
    set: (
      id: string,
      value: number,
      type?: {
        name?: string;
        description?: string;
        max?: number | false;
      }
    ) => {
      let item = items[id];

      if (item) {
        item.value.set(value);
      } else {
        items[id] = item = {
          name: id,
          description: 'no description',
          max: false,
          value: writable(value),
        };
      }

      if (type) {
        const { name, description, max } = type;

        if (name !== undefined) item.name = name;
        if (description !== undefined) item.description = description;
        if (max !== undefined) item.max = max;
      }

      return item;
    },
    change: (
      id: string,
      setter: (prevVal: number) => number,
    ) => {
      const item = items[id];

      if (item) {
        item.value.update((v) => {
          const val = setter(v);
          return item.max !== false ? (val > item.max ? item.max : val) : val;
        });
      }

      return item;
    },
  };

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
    {#each actions as { id, ...args }}
      <ActionSlot {...args} />
    {/each}
  </ul>
  <ul id="itemList">
    {#each Object.entries(items) as [_, data]}
      <ItemSlot {...data} />
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
