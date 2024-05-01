<script lang="ts">
  import { icon, SvgIcon } from '$lib/Util';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void];
  }>();

  export let title: string, description: string, zIndex: number;

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

<svelte:document
  on:mousemove={move}
  on:mouseup={up}
  on:dragstart={() => (isDrag = false)}
/>

<article id="msg" bind:this={main}>
  <div class="tab" on:mousedown={down} role="presentation">
    <span>{title}</span>
    <SvgIcon type="done" color="white" />
    <img
      class="nodrag"
      bind:this={closer}
      alt="close"
      src={icon('close', 'svg')}
      on:click={() => dispatch('destroy')}
      role="presentation"
    />
  </div>
  <div class="desc">{description}</div>
  <div class="submit">
    <img
      class="nodrag"
      alt="submit"
      src={icon('done', 'svg')}
      on:click={() => {
        let submitDelete = true;
        dispatch('submit', [() => (submitDelete = false)]);
        if (submitDelete) dispatch('destroy');
      }}
      role="presentation"
    />
  </div>
</article>

<style lang="scss" module>
  article#msg {
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

      img {
        cursor: pointer;
        transition: all ease 0.5s;
        filter: invert(100%);
        border-radius: 4px;

        &:hover {
          box-shadow: 0 0 1px 1px gray;
          color: white;
        }

        &:active {
          filter: invert(0%);
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

      img {
        border-radius: 4px;
        cursor: pointer;
        transition: all ease 0.5s;
        filter: invert(100%);

        &:hover {
          box-shadow: 0 0 3px 3px gray;
          color: white;
        }

        &:active {
          filter: invert(0%);
          box-shadow: none;
          background-color: gray;
        }
      }
    }
  }
</style>
