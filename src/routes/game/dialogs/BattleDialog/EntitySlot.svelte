<script lang="ts">
  import type { EntityInstanceType } from '$lib/game/Entity';
  import { get, type Writable } from 'svelte/store';
  import { statTooltip } from './StatTooltip';

  export let entity: EntityInstanceType | undefined = undefined,
    glow: Writable<boolean> | undefined;

  let hpSub: () => void,
    hpVal = '0%',
    hpTitle = '',
    spSub: () => void,
    spVal = '0%',
    spTitle = '';

  $: {
    // 이전에 구독했던 이벤트 갱신(구독해제)
    hpSub?.();
    spSub?.();

    // 프로그래스 바 연동
    if (entity !== undefined) {
      const {
        hp: { current: hp, max: mhp },
        sp: { current: sp, max: msp },
      } = entity;

      hpSub = hp.subscribe((v) => {
        const max = get(mhp);
        hpVal = (100 * v) / max + '%';
        hpTitle = isNaN(v) ? '💖 ? / ? ' : `💖 ${v}p / ${max}p`;
      });
      spSub = sp.subscribe((v) => {
        const max = get(msp);
        spVal = (100 * v) / max + '%';
        spTitle = isNaN(v) ? '✨ ? / ? ' : `✨ ${v}p / ${max}p`;
      });
    }
  }
</script>

<div class="entitySlot" class:glow={glow != undefined && $glow}>
  {#if entity !== undefined}
    <span class="portrait">
      {entity.name}
    </span>
    <div class="status">
      <div class="progress" title={hpTitle} use:statTooltip>
        <div class="bar hp">&nbsp;</div>
      </div>
      <div class="progress" title={spTitle} use:statTooltip>
        <div class="bar sp">&nbsp;</div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss" module>
  .glow {
    animation: glowing 2s infinite;
  }

  div.entitySlot {
    display: flex;
    padding: 2px;
    border: white solid 1px;
    border-radius: 8px;

    div.status {
      padding: 4px;

      div.progress + div.progress {
        margin-top: 4px;
      }

      div.progress {
        min-width: 150px;
        width: 100%;
        padding: 0;
        background-color: rgba(128, 128, 128, 0.4);
        border-radius: 12px;
        overflow: hidden;

        div.bar {
          font-size: smaller;
          height: min-content;
          &.sp {
            background: linear-gradient(
              90deg,
              rgba(97, 73, 154, 0.8) 25%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(97, 73, 154, 0.8) 75%
            );
            width: bind(spVal);

            background-size: 200% 100%;
            animation: shimmer 2s infinite;
            transition: width 0.3s;
          }

          &.hp {
            background: crimson;
            width: bind(hpVal);
          }
        }
      }

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

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes glowing {
    0%,
    100% {
      background-color: rgba(220, 20, 60, 0.5);
    }
    50% {
      background-color: rgba(220, 20, 60, 0.1);
    }
  }
</style>
