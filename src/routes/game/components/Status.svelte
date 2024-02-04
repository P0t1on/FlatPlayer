<script lang="ts">
  import { toStyleVariables } from "$lib";
  import type { Writable } from "svelte/store";

  export let value: Writable<number>,
    color: Writable<string>,
    max: Writable<number>,
    name: Writable<string> | undefined,
    unit: string | undefined;
</script>

{#if $max === 0}
  <div
    class={"status" + (name !== undefined ? " nolimit" : "")}
    style={toStyleVariables({ color: $color })}
  >
    {#if name !== undefined}
      <div>&nbsp;{$name}</div>
      <div>{$value + (unit ? unit : "")}&nbsp;</div>
    {:else}
      {$value + (unit ? unit : "")}&nbsp;
    {/if}
  </div>
{:else}
  <div
    class="status limit"
    style={toStyleVariables({ color: $color }) +
      `--fill: ${($value * 100) / $max};`}
  >
    {#if name !== undefined}
      <div class="name">&nbsp;{$name}</div>
      <div class="progress">&nbsp;{$value + (unit ? unit : "")}&nbsp;</div>
    {:else}
      <div class="progress">&nbsp;{$value + (unit ? unit : "")}&nbsp;</div>
    {/if}
  </div>
{/if}

<style lang="scss">
  div.status {
    text-align: right;
    user-select: none;

    background-color: var(--color);
    border: 4px solid #0000004d;
    border-radius: 16px;
    margin-bottom: 4px;

    &.nolimit {
      display: flex;
      justify-content: space-around;
    }

    &.limit {
      background-color: color-mix(in srgb, var(--color), #000 40%);

      div.name {
        text-align: left;
      }
    }

    div.progress {
      background-color: var(--color);
      border-radius: 16px;
      width: calc(var(--fill) * 1%);
    }
  }
</style>
