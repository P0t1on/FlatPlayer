<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { get, type Writable } from 'svelte/store';

  export let name: string,
    cooltime: {
      max: number;
      current: Writable<number>;
    },
    worker: {
      max?: Writable<number>;
      current: Writable<number>;
    };
  const dispatch = createEventDispatcher<{
    execute: number;
    reqChangeWorker: number;
  }>();

  let main: HTMLLIElement;
  let fill: string;

  function onWheel(e: WheelEvent) {
    console.log(e.deltaY);
  }

  onMount(() => {
    let executable = get(worker.current) > 0;
    const cMax = cooltime.max;

    cooltime.current.subscribe((v) => {
      fill = `${(100 * v) / cMax}%`;
      if (main && executable && v >= cMax) {
        cooltime.current.set(0);
        dispatch('execute', get(worker.current));
      }
    });

    worker.current.subscribe((v) => (executable = v > 0));
  });
</script>

<li class="actionSlot" bind:this={main}>
  <span>{name}</span>
  <div on:mousewheel={onWheel}>h</div>
</li>

<style lang="scss" module>
  li.actionSlot {
    background: linear-gradient(
      to right,
      white 0 bind(fill),
      black bind(fill) 100%
    );
    margin: 12px;
    padding: 8px;
    mix-blend-mode: difference;
    font-weight: bold;
    font-size: large;
    user-select: none;
    border: solid 2px white;

    display: flex;

    span {
      mix-blend-mode: difference;
      color: white;
    }
  }
</style>
