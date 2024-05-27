<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { get, writable } from 'svelte/store';
  import ActionSlot from './ActionSlot.svelte';
  import ItemSlot from './ItemSlot.svelte';
  import type {
    ActionCollectionType,
    ActionManagerType,
    ActionType,
    ItemCollectionType,
    ItemManagerType,
  } from '$lib/game/Basement';

  export let paused: boolean;

  const totalWorkers = writable(1),
    availableWorker = writable(get(totalWorkers)),
    dispatch = createEventDispatcher<{
      load: [ItemManagerType, ActionManagerType];
    }>();

  let items: ItemCollectionType = {
    workers: {
      name: writable('Worker'),
      description: writable('PEOPLE'),
      max: totalWorkers,
      value: availableWorker,
    },
  };

  let actions: ActionCollectionType = {};

  let timeUpdater: NodeJS.Timeout;
  const itemManager: ItemManagerType = {
    set(id, value, type) {
      let item = items[id];

      if (item !== undefined) {
        item.value.set(value);
      } else {
        items[id] = item = {
          name: writable(id),
          description: writable('no description'),
          max: false,
          value: writable(value),
        };
      }

      if (type) {
        const { name, description, max } = type;

        if (name !== undefined) item.name.set(name);
        if (description !== undefined) item.description.set(description);
        if (max !== undefined && max !== false) {
          const itemMax = item.max;
          if (itemMax !== false) itemMax.set(max);
          else {
            item.max = writable(max);
            itemManager.update(id);
          }
        }
      }

      return item;
    },

    update(id) {
      const before = items[id];
      return before !== undefined ? (items[id] = before) : undefined;
    },

    updateAll() {
      return (items = items);
    },

    release(id) {
      if (id !== 'workers') {
        const result = items[id];
        delete items[id];

        return result;
      } else return;
    },

    getData() {
      return items;
    },
  };

  const actionManager: ActionManagerType = {
    register(
      id,
      { name, cooltime: { max, startCooltime }, requiredWorker, method }
    ) {
      if (actions[id] !== undefined) {
        console.debug(`${id}는 이미 존재하는 액션입니다.`);
        return;
      }

      const action: ActionType = {
        name: name ?? id,
        method: ({ detail }) => method(detail),
        cooltime: {
          max: writable(max),
          current: writable(startCooltime ?? 0),
        },
        worker: {
          require: writable(requiredWorker ?? 1),
          current: writable(0),
        },
      };
      actions[id] = action;

      return action;
    },

    update(id) {
      const before = actions[id];
      return before !== undefined ? (actions[id] = before) : undefined;
    },

    updateAll() {
      return (actions = actions);
    },

    release(id) {
      const result = actions[id];
      delete actions[id];
      return result;
    },

    getData() {
      return actions;
    },
  };

  onMount(() => {
    timeUpdater = setInterval(() => {
      if (paused) return;

      for (const id in actions) {
        const {
          cooltime: { current: cCool },
          worker: { current: worker },
        } = actions[id] as ActionType;

        if (get(worker) > 0) {
          cCool.update((v) => v + 1);
        }
      }
    }, 10);

    Object.entries(actions).forEach(
      ([
        _,
        {
          worker: { require, current },
        },
      ]) => {
        availableWorker.update((v) => v - get(require) * get(current));
      }
    );

    totalWorkers.subscribe((v) => {
      availableWorker.set(v);
      Object.entries(actions).forEach(
        ([
          _,
          {
            worker: { require, current },
          },
        ]) => {
          availableWorker.update((v) => v - get(require) * get(current));
        }
      );
    });

    dispatch('load', [itemManager, actionManager]);
  });

  onDestroy(() => {
    if (timeUpdater) clearInterval(timeUpdater);
  });
</script>

<article id="basement">
  <ul id="actionList">
    {#each Object.entries(actions) as [_, { method, worker, ...args }]}
      <ActionSlot
        {...{
          ...args,
          availableWorker,
          worker,
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
      height: max-content;
      min-height: 20px;
      min-width: 150px;
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

      height: max-content;
      margin-left: 8px;
      padding: 0;

      border: 2px solid white;
    }
  }
</style>
