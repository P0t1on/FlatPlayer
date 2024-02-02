<script lang="ts">
  import type { Writable } from "svelte/store";

  export let statusValue: Writable<number>, color: string, max: number;

  let backC = color;
</script>

{#if max === 0}
  <div class="status" style="background-color:{color};">
    {$statusValue}
  </div>
{:else}
  <div class="status" style="background-color:{color};">
    {$statusValue} / {max}
  </div>
{/if}

<style lang="scss">
  div.status {
    user-select: none;

    margin-left: 4px;
    margin-right: 4px;
    padding: 8px;
    float: left;

    border: 4px solid #0000004d;
    border-radius: 8px;
  }
</style>
