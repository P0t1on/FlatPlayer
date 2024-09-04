<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { get, type Writable } from 'svelte/store';
  import SvgIcon from '$lib/SVGIcon.svelte';

  export let name: string,
    cooltime: {
      max: Writable<number>;
      current: Writable<number>;
    },
    availableWorker: Writable<number>,
    worker: {
      require: Writable<number>;
      current: Writable<number>;
    };

  const dispatch = createEventDispatcher<{
    execute: number;
  }>();

  let fill: string, detailHeight: string;
  let detailDiv: HTMLDivElement;
  let workerCurrent = worker.current,
    requireWorkers = worker.require;

  function changeWorker(val: number) {
    if (val > 0) {
      const extra = get(availableWorker),
        req = get(requireWorkers);
      if (extra >= req * val) {
        availableWorker.update((v) => v - req * val);
        workerCurrent.update((v) => v + val);
      } else {
        availableWorker.update((v) => v - req * Math.floor(extra / req));
        workerCurrent.update((v) => v + Math.floor(extra / req));
      }
    } else if (val < 0) {
      const wc = get(workerCurrent);

      if (wc >= -val) {
        availableWorker.update((v) => v - get(requireWorkers) * val);
        workerCurrent.update((v) => v + val);
      } else if (wc > 0) {
        availableWorker.update((v) => v - get(requireWorkers) * (val + wc));
        workerCurrent.set(0);
      }
    }
  }

  onMount(() => {
    cooltime.current.subscribe((v) => {
      const cMax = get(cooltime.max);
      fill = `${(100 * v) / cMax}%`;

      if (v >= cMax) {
        cooltime.current.set(0);
        dispatch('execute', get(workerCurrent));
      }
    });

    detailHeight = detailDiv.scrollHeight + 'px';
  });
</script>

<li class="actionSlot">
  <div class="summary">
    <span class="text">{name}</span>
    <span class="wrapper">
      <div class="text" on:wheel={(e) => changeWorker(e.deltaY < 0 ? 1 : -1)}>
        {$workerCurrent}
        <span class="icons">
          <SvgIcon
            type="keyboard_arrow_up"
            size={16}
            on:click={() => changeWorker(1)}
          />
          <SvgIcon
            type="keyboard_arrow_down"
            size={16}
            on:click={() => changeWorker(-1)}
          />
        </span>
      </div>
    </span>
  </div>
  <div class="detail" bind:this={detailDiv}>
    Available Worker : {Math.floor($availableWorker / $requireWorkers)}
  </div>
</li>

<style lang="scss" module>
  li.actionSlot {
    display: flex;
    flex-direction: column;

    div.summary {
      background: linear-gradient(
        to right,
        white 0 bind(fill),
        black bind(fill) 100%
      );
      margin: 6px 12px 0px 12px;
      padding: 8px;
      font-weight: bold;
      font-size: large;
      user-select: none;
      border: solid 2px white;

      display: flex;
      align-items: center;
      justify-content: space-between;

      span.text,
      div.text {
        mix-blend-mode: difference;
        color: white;
      }
      span.wrapper {
        div.text {
          padding: 4px;
          margin-left: 20px;

          border-radius: 4px;
          outline: 2px solid white;

          display: flex;
          align-items: center;

          span.icons {
            margin-left: 4px;
            display: flex;
            flex-direction: column;

            svg {
              transition: all ease 0.5s;
              border-radius: 2px;

              &:hover {
                background-color: gray;
              }
            }
          }
        }
      }
    }

    &:first-child > div.summary {
      margin-top: 12px;
    }

    &:last-child > div.detail {
      margin-bottom: 10px;
    }

    div.detail {
      transition: all ease 0.5s;
      color: white;
      opacity: 0;

      position: relative;
      top: 0;
      height: 0px;
      overflow: hidden;
      margin: 0 12px 4px 12px;
      padding: 0 8px 0 8px;
      border: 2px solid white;
      border-radius: 0 0 8px 8px;
    }

    &:hover {
      div.detail {
        height: bind(detailHeight);
        opacity: 1;
        padding: 4px 8px 8px 8px;
        border: 2px solid white;
        border-top: none;
      }
    }
  }
</style>
