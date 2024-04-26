<script lang="ts">
  import { icon } from '$lib/Util';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
  }>();

  export let title: string,
    description: string,
    zIndex: number,
    onSubmit: () => void;

  let main: HTMLElement,
    closer: HTMLImageElement,
    isDrag = false,
    x = 0,
    y = 0;

  const down = (e: MouseEvent) => {
      if (e.target !== closer) {
        dispatch('focus');
        isDrag = true;
        x = e.clientX;
        y = e.clientY;
      }
    },
    move = (e: MouseEvent) => {
      if (isDrag) {
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        main.style.top = `${main.offsetTop + dy}px`;
        main.style.left = `${main.offsetLeft + dx}px`;

        x = e.clientX;
        y = e.clientY;
      }
    },
    up = (e: MouseEvent) => {
      isDrag = false;
    };
</script>

<svelte:document on:mousemove={move} on:mouseup={up} />

<article id="msg" bind:this={main}>
  <div class="tab" on:mousedown={down} role="presentation">
    <span>{title}</span>
    <img
      class="nodrag"
      bind:this={closer}
      alt="close"
      src={icon('close')}
      on:click={() => dispatch('destroy')}
      role="presentation"
    />
  </div>
  <div>{description}</div>
  <div class="submit"></div>
</article>

<style lang="scss" module>
  article#msg {
    position: absolute;
    background-color: white;

    top: 50%;
    left: 50%;
    min-width: 100px;
    z-index: bind(zIndex);

    padding: 8px;
    border-radius: 8px;

    user-select: none;

    div.tab {
      display: flex;
      justify-content: space-between;

      img {
        cursor: pointer;
        transition: all ease 0.5s;

        &:hover {
          box-shadow: 0 0 3px 3px gray;
        }

        &:active {
          box-shadow: none;
          background-color: gray;
        }
      }
    }
  }
</style>
