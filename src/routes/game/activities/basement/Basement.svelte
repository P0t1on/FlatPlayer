<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { get, writable, type Writable } from 'svelte/store';
  import { initOrientation } from '../../data/Orientation';
  import ActionSlot from './ActionSlot.svelte';
  import ItemSlot from './ItemSlot.svelte';
  import type {
    ActionType,
    ItemManagerType,
    ItemType,
  } from '$lib/game/Basement';
  import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';

  export let dialogManager: DialogManagerType, logger: LoggerType;
  const totalWorkers = writable(10),
    allocWorkers = writable(0);

  const items: {
    [key: string]: {
      value: Writable<number>;
    } & ItemType;
  } = {
    workers: {
      name: 'Worker',
      description: 'PEOPLE',
      max: totalWorkers,
      value: allocWorkers,
    },
    rog: {
      name: 'Rog',
      description: 'rog item desc',
      max: false,
      value: writable(3),
    },
    stone: {
      name: 'Stone',
      description: 'stone item desc',
      max: writable(3),
      value: writable(2),
    },
  };

  const seekCooltime = writable(0);

  const actions: ActionType[] = [
    {
      id: 'test1',
      name: '테스트1',
      cooltime: { max: 800, current: writable(0) },
      method: ({ detail: worker }) =>
        itemManager.change('stone', (v) => v + worker),
      worker: {
        require: writable(2),
        current: writable(0),
      },
    },
    {
      id: 'seek',
      name: '주위를 탐색한다.',
      method: ({ detail: worker }) =>
        itemManager.change('rog', (v) => v + worker),
      cooltime: { max: 400, current: seekCooltime },
      worker: {
        require: writable(1),
        current: writable(1),
      },
    },
  ];

  let timeUpdater: NodeJS.Timeout;
  const itemManager: ItemManagerType = {
    set(id, value, type) {
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
        if (max !== undefined && max !== false) item.max;
      }

      return item;
    },
    change(id, setter) {
      const item = items[id];

      if (item) {
        item.value.update((v) => {
          const val = setter(v),
            max = item.max;
          return max !== false ? (val > get(max) ? get(max) : val) : val;
        });
      }

      return item;
    },
  };

  onMount(() => {
    timeUpdater = setInterval(() => {
      for (const {
        cooltime,
        worker: { current },
      } of actions) {
        if (get(current) > 0)
          cooltime.current.update((v) => (v < cooltime.max ? v + 1 : v));
      }
    }, 10);

    actions.forEach(({ worker: { require, current } }) => {
      allocWorkers.update((v) => v + get(require) * get(current));
    });

    initOrientation(items, actions, itemManager, dialogManager, logger);
  });

  onDestroy(() => {
    if (timeUpdater) clearInterval(timeUpdater);
  });
</script>

<article id="basement">
  <ul id="actionList">
    {#each actions as { id, method, worker: { current: workerCurrent, require: requireWorkers }, ...args }}
      <ActionSlot
        {...{
          ...args,
          totalWorkers,
          allocWorkers,
          workerCurrent,
          requireWorkers,
        }}
        on:execute={method}
      />
    {/each}
  </ul>
  <ul id="itemList">
    {#each Object.entries(items) as [_, data]}
      <ItemSlot {...data} />
    {/each}
  </ul>
</article>

<style lang="scss">
  article#basement {
    padding: 8px;
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

    ul#itemList {
      list-style: none;

      margin-left: 8px;
      padding: 0;

      border: 2px solid white;
    }
  }
</style>
