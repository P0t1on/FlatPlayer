<script lang="ts">
  import { onMount } from 'svelte';
  import { get, type Writable } from 'svelte/store';

  export let value: Writable<number>,
    name: Writable<string>,
    description: Writable<string>,
    max: Writable<number> | false;

  let fill = '0%',
    m = 0;

  onMount(() => {
    if (max !== false) {
      value.subscribe((v) => {
        fill = `${(v * 100) / get(max)}%`;
      });

      max.subscribe((v) => (m = v));
    }
  });
</script>

{#if max === false}
  <li id="itemSlot" title={$description}>
    <div class="name">{$name}</div>
    <div class="value">{$value}</div>
  </li>
{:else}
  <li id="itemSlot" title={$description}>
    <div class="name">{$name}</div>
    <div class="value max"><span>{$value} / {m}</span></div>
  </li>
{/if}

<style lang="scss" module>
  li#itemSlot {
    color: white;
    border: 2px solid white;
    margin: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    user-select: none;

    div.name {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding-left: 4px;
    }

    div.value {
      min-width: 20px;
      margin: 2px 2px 2px 4px;
      padding: 2px;

      border: 2px solid white;

      text-align: center;

      &.max {
        background: linear-gradient(
          to top,
          white 0 bind(fill),
          black bind(fill) 100%
        );

        span {
          mix-blend-mode: difference;
        }
      }
    }
  }
</style>
