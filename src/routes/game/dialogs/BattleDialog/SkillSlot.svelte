<script lang="ts">
  import type { SkillType } from '$lib/game/Entity';

  export let skillInfo: SkillType | undefined = undefined;
</script>

<div class="skillSlot">test</div>

<style lang="scss" module>
  div.skillslot {
    width: 50px;
    margin: 8px;
    padding: 8px;
    border: 1px solid white;
    border-radius: 5px;
  }
</style>
