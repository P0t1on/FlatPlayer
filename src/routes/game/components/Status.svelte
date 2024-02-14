<script lang="ts">
  import { toStyleVariables } from "$lib";
  import type { Writable } from "svelte/store";

  export let value: Writable<number>,
    color: Writable<string>,
    max: Writable<number>,
    name: Writable<string> | undefined,
    unit: string | undefined;
</script>

<div class="status" style={toStyleVariables({ color: $color })}>
  {#if $max === 0}
    {#if name !== undefined}
      <div class="name"><div class="textWrapper">{$name}</div></div>
      <div class="value"><div class="textWrapper">{$value + (unit ? unit : "")}</div></div>
    {:else}
      <div class="textWrapper">{$value + (unit ? unit : "")}</div>
    {/if}
  {:else}
    {#if name !== undefined}
      <div class="name"><div class="textWrapper">{$name}</div></div>
    {/if}
    <div class="progress" style={`width: ${($value * 100) / $max}%;`}>
      <div class="textWrapper">{$value + (unit ? unit : "")}</div>
    </div>
  {/if}
</div>

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

    div.textWrapper {
      padding: 0 4px 0 4px;
    }
  }
</style>
