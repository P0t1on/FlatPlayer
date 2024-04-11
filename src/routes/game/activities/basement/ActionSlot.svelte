<script lang="ts">
  import type { Writable } from 'svelte/store';

  export let name: string,
    cooltime: number | false,
    currentCooltime: Writable<number>,
    method: () => void;
</script>

<li class="actionSlot">
  <span class=""></span>
  {name} - {($currentCooltime / 10).toFixed(1)}
</li>

<style lang="scss">
  li.actionSlot {
    margin: 12px;
    padding: 8px;
    color: white;
    user-select: none;
    border: solid 2px white;
  }
</style>
