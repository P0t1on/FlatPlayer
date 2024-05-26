<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { get, writable, type Writable } from 'svelte/store';
  import ActionSlot from './ActionSlot.svelte';
  import ItemSlot from './ItemSlot.svelte';
  import type {
    ActionManagerType,
    ActionType,
    ItemManagerType,
    ItemType,
  } from '$lib/game/Basement';

  const totalWorkers = writable(10),
    availableWorker = writable(10),
    dispatch = createEventDispatcher<{
      load: [ItemManagerType, ActionManagerType];
    }>();

  let items: {
    [key: string]: {
      value: Writable<number>;
    } & ItemType;
  } = {
    workers: {
      name: 'Worker',
      description: 'PEOPLE',
      max: totalWorkers,
      value: availableWorker,
    },
  };

  let actions: { [key: string]: ActionType } = {};

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

    // TODO 이거 ts-ignore 없이도 타입 문제없이 구현할 방법 찾아야됨
    // @ts-ignore
    update(id) {
      if (id !== undefined) {
        const before = items[id];
        if (before !== undefined) {
          return (items[id] = before);
        } else {
          return;
        }
      } else return (items = items);
    },

    release(id) {
      if (id !== 'workers') {
        delete items[id];
      }
    },
    data: items,
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

    // TODO 이거 ts-ignore 없이도 타입 문제없이 구현할 방법 찾아야됨
    // @ts-ignore
    update(id) {
      if (id !== undefined) {
        const before = actions[id];
        if (before !== undefined) {
          return (actions[id] = before);
        } else {
          return;
        }
      } else return (actions = actions);
    },

    release(id) {
      delete actions[id];
    },

    data: actions,
  };

  onMount(() => {
    timeUpdater = setInterval(() => {
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
