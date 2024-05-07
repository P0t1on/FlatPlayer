<script lang="ts">
  import { SvgIcon } from '$lib/Util';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void];
  }>();

  export let title = '',
    description = '',
    zIndex: number,
    canIgnore = true;

  let main: HTMLElement,
    closer: HTMLSpanElement,
    isDrag = false,
    x = 0,
    y = 0;

  function down(e: MouseEvent) {
    if (
      !closer ||
      (e.target !== closer && !closer.contains(e.target as HTMLElement))
    ) {
      isDrag = true;
      x = e.clientX;
      y = e.clientY;
    }
  }

  function move(e: MouseEvent) {
    if (isDrag) {
      const dx = e.clientX - x;
      const dy = e.clientY - y;

      main.style.top = `${main.offsetTop + dy}px`;
      main.style.left = `${main.offsetLeft + dx}px`;

      x = e.clientX;
      y = e.clientY;
    }
  }

  function up(e: MouseEvent) {
    isDrag = false;
  }
</script>

<svelte:document on:mousemove={move} on:mouseup={up} />

<article
  id="dialog"
  bind:this={main}
  on:mousedown={() => dispatch('focus')}
  role="presentation"
>
  <slot name="tab">
    <div class="tab" on:mousedown={down} role="presentation">
      <span>{title}</span>
      {#if canIgnore}
        <span
          class="nodrag button"
          bind:this={closer}
          on:click={() => dispatch('destroy')}
          role="presentation"
        >
          <SvgIcon type="close" color="white" />
        </span>
      {/if}
    </div>
  </slot>
  <slot name="content">
    <div class="desc">{description}</div>

    <div class="submit">
      <span
        class="nodrag"
        on:click={() => {
          let submitDelete = true;
          dispatch('submit', [() => (submitDelete = false)]);
          if (submitDelete) dispatch('destroy');
        }}
        role="presentation"
      >
        <SvgIcon type="done" color="white" />
      </span>
    </div>
  </slot>
</article>

<style lang="scss" module>
  article#dialog {
    position: absolute;
    background-color: black;
    color: white;

    top: 30%;
    left: 40%;
    min-width: 100px;
    z-index: bind(zIndex);

    border-radius: 8px;
    outline: 4px double white;

    user-select: none;

    div.tab {
      border-radius: 8px 8px 0 0;
      padding: 4px 8px 4px 8px;
      min-width: 12vw;
      background-color: black;
      display: flex;
      justify-content: space-between;
      outline: 4px double white;

      span.button {
        height: 24px;
        cursor: pointer;
        transition: all ease 0.5s;
        border-radius: 4px;

        &:hover {
          box-shadow: 0 0 1px 1px gray;
          color: white;
        }

        &:active {
          filter: invert(100%);
          box-shadow: none;
          background-color: gray;
        }
      }
    }

    div.desc {
      padding: 6px;
    }

    div.submit {
      display: flex;
      justify-content: flex-end;
      padding: 6px;

      span {
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        transition: all ease 0.5s;

        &:hover {
          box-shadow: 0 0 3px 3px gray;
          color: white;
        }

        &:active {
          filter: invert(100%);
          box-shadow: none;
          background-color: gray;
        }
      }
    }
  }
</style>
