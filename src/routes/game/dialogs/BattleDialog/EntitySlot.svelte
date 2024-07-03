<script lang="ts">
  import type { EntityInstanceType } from '$lib/game/Entity';

  export let entity: EntityInstanceType | undefined = undefined;
</script>

<div class="entitySlot">
  {#if entity !== undefined}
    <span class="portrait">
      {entity.name}
    </span>
  {/if}
</div>

<style lang="scss" module>
  div.entitySlot {
    display: flex;
    width: 100px;
  }
</style>
