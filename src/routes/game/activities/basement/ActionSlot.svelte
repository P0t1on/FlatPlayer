<script lang="ts">
  export let name: string, cooltime: number | false, method: () => void;
</script>

<li class="actionSlot"></li>

<style lang="scss">
  li.actionSlot {
    background-color: white;
  }
</style>
