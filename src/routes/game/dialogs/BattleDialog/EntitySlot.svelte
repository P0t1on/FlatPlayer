<script lang="ts">
  import type { EntityInstanceType } from '$lib/game/Entity';
  import { get } from 'svelte/store';
  import { statTooltip } from './StatTooltip';

  export let entity: EntityInstanceType | undefined = undefined;

  let hpSub: () => void,
    hpVal = 0,
    hpTitle = '',
    spSub: () => void,
    spVal = 0,
    spTitle = '';

  $: {
    hpSub?.();
    spSub?.();

    if (entity !== undefined) {
      const {
        hp: { current: hp, max: mhp },
        sp: { current: sp, max: msp },
      } = entity;

      hpSub = hp.subscribe((v) => {
        const max = get(mhp);
        hpVal = (100 * v) / max;
        hpTitle = `💖 ${v} / ${max}`;
      });
      spSub = sp.subscribe((v) => {
        const max = get(msp);
        spVal = (100 * v) / max;
        spTitle = `✨ ${v} / ${max}`;
      });
    }
  }
</script>

<div class="entitySlot">
  {#if entity !== undefined}
    <span class="portrait">
      {entity.name}
    </span>
    <div class="status">
      {#if isNaN(hpVal)}
        <progress
          class="hp infinite"
          title="💖 ? / ?"
          use:statTooltip
          max={100}
          value={100}
        />
      {:else}
        <progress
          class="hp"
          title={hpTitle}
          use:statTooltip
          max={100}
          value={hpVal}
        />
      {/if}
      {#if isNaN(spVal)}
        <progress
          class="sp infinite"
          title="✨ ? / ?"
          use:statTooltip
          max={100}
          value={100}
        />
      {:else}
        <progress
          class="sp"
          title={spTitle}
          use:statTooltip
          max={100}
          value={spVal}
        />
      {/if}
    </div>
  {/if}
</div>

<style lang="scss" module>
  div.entitySlot {
    display: flex;

    div.status {
      width: min-content;

      progress {
        appearance: none;
        width: 120px;

        &::-webkit-progress-bar {
          background-color: rgba(255, 255, 255, 0.4);
          border-radius: 8px;
          overflow: hidden;
        }

        &.hp::-webkit-progress-value {
          background-color: crimson;
        }

        &.sp::-webkit-progress-value {
          background-color: #61499a;
        }
      }
    }
  }
</style>
