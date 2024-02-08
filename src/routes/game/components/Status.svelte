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
  <div class="status" style={toStyleVariables({ color: $color })}>
    {#if name !== undefined}
      <div class="name">&nbsp;{$name}&nbsp;</div>
      <div class="value">&nbsp;{$value + (unit ? unit : "")}&nbsp;</div>
    {:else}
      {$value + (unit ? unit : "")}&nbsp;
    {/if}
  </div>
{:else}
  <div
    class="status"
    style={toStyleVariables({ color: $color, fill: ($value * 100) / $max })}
  >
    {#if name !== undefined}
      <div class="name">&nbsp;{$name}&nbsp;</div>
      <div class="progress">&nbsp;{$value + (unit ? unit : "")}&nbsp;</div>
    {:else}
      <div class="progress">&nbsp;{$value + (unit ? unit : "")}&nbsp;</div>
    {/if}
  </div>
{/if}

<style lang="scss">
  @mixin status-value {
    padding: 1px;
    background-color: var(--color);
    border-radius: 16px;
  }

  div.status {
    text-align: right;
    user-select: none;

    background-color: color-mix(in srgb, var(--color), #000 40%);
    border: 3px solid #0000004d;
    border-radius: 16px;
    margin-bottom: 4px;
    padding: 3px;

    div.value {
      @include status-value;
      width: 100%;
    }

    div.progress {
      @include status-value;
      width: calc(var(--fill) * 1%);
    }

    div.name {
      margin-bottom: 3px;
      padding: 2px;
      text-align: left;
      border-radius: 16px;
      width: min-content;
      background-color: color-mix(in srgb, var(--color), #ffffff 40%);
      font-weight: bold;
      font-size: smaller;
    }
  }
</style>
