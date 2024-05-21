<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { get, writable, type Writable } from 'svelte/store';
  import { initOrientation } from '../../data/Orientation';
  import ActionSlot from './ActionSlot.svelte';
  import ItemSlot from './ItemSlot.svelte';
  import type {
    ActionManagerType,
    ActionType,
    ItemManagerType,
    ItemType,
  } from '$lib/game/Basement';
  import type { DialogManagerType, LoggerType } from '$lib/game/Dialogs';

  export let dialogManager: DialogManagerType, logger: LoggerType;
  const totalWorkers = writable(10),
    availableWorker = writable(10);

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

  let actions: { [key: string]: ActionType } = {
    test1: {
      name: '테스트1',
      cooltime: { max: writable(800), current: writable(0) },
      method: ({ detail: worker }) =>
        itemManager.change('stone', (v) => v + worker),
      worker: {
        require: writable(2),
        current: writable(0),
      },
    },
    seek: {
      name: '주위를 탐색한다.',
      method: ({ detail: worker }) =>
        itemManager.change('rog', (v) => v + worker),
      cooltime: { max: writable(400), current: seekCooltime },
      worker: {
        require: writable(1),
        current: writable(1),
      },
    },
  };

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
    update(id) {
      if (id !== undefined) {
        items[id] = items[id] as { value: Writable<number> } & ItemType;
        return;
      } else return (items = items);
    },
    release(id) {
      if (id !== 'workers') {
        delete items[id];
      }
    },
  };

  const actionManager: ActionManagerType = {
    register(
      id,
      { name, cooltime: { max, startCooltime }, requiredWorker, method }
    ) {
      const action: ActionType = {
        name: name ?? id,
        method: ({ detail }) => method(detail),
        cooltime: {
          max: writable(max),
          current: writable(startCooltime),
        },
        worker: {
          require: writable(requiredWorker ?? 1),
          current: writable(0),
        },
      };

      actions[id] = action;

      return action;
    },

    release(id) {
      delete actions[id];
    },
  };

  onMount(() => {
    timeUpdater = setInterval(() => {
      for (const id in actions) {
        const {
          cooltime,
          worker: { current },
        } = actions[id] as ActionType;

        if (get(current) > 0)
          cooltime.current.update((v) => (v < get(cooltime.max) ? v + 1 : v));
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

    initOrientation(
      items,
      actions,
      itemManager,
      actionManager,
      dialogManager,
      logger
    );
  });

  onDestroy(() => {
    if (timeUpdater) clearInterval(timeUpdater);
  });
</script>

<article id="basement">
  <ul id="actionList">
    {#key actions}
      {#each Object.entries(actions) as [_, { method, worker: { current: workerCurrent, require: requireWorkers }, ...args }]}
        <ActionSlot
          {...{
            ...args,
            availableWorker,
            workerCurrent,
            requireWorkers,
          }}
          on:execute={method}
        />
      {/each}
    {/key}
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
