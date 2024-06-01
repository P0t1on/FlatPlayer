<script lang="ts">
  import SvgIcon from '$lib/SVGIcon.svelte';
  import { createEventDispatcher, onMount, tick } from 'svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void];
  }>();

  export let title: string | false = '',
    description = '',
    zIndex: number,
    canIgnore = true;

  let main: HTMLElement,
    closer: HTMLSpanElement,
    desc: HTMLDivElement,
    isDescAnimPlaying = true,
    isDrag = false,
    descAnim: NodeJS.Timeout,
    x = 0,
    y = 0;

  function skipDescAnim() {
    isDescAnimPlaying = false;
    if (descAnim) clearInterval(descAnim);
    desc.innerText = description;
  }

  $: {
    if (desc) desc.style.cursor = isDescAnimPlaying ? 'pointer' : 'auto';
  }

  function tabMouseDown(e: MouseEvent) {
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

  onMount(async () => {
    {
      desc.innerText = description;
      desc.style.width = desc.offsetWidth + 'px';
      desc.style.height = desc.offsetHeight + 'px';
      desc.innerText = '';
    }

    let i = 0,
      m = description.length;
    descAnim = setInterval(() => {
      desc.innerText += description[i];
      i++;
      if (i >= m) {
        isDescAnimPlaying = false;
        clearInterval(descAnim);
      }
    }, 50);
  });
</script>

<svelte:document
  on:mousemove={move}
  on:mouseup={up}
  on:keydown={(e) => {
    if (e.keyCode === 32) skipDescAnim();
  }}
/>

<article
  id="dialog"
  bind:this={main}
  on:mousedown={() => dispatch('focus')}
  role="presentation"
>
  <slot name="tab">
    {#if !canIgnore && title !== false}
      <div class="tab" on:mousedown={tabMouseDown} role="presentation">
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
    {/if}
  </slot>
  <slot name="content">
    <div
      class="desc"
      bind:this={desc}
      on:click={skipDescAnim}
      role="presentation"
    />

    <div
      class="submit"
      style={isDescAnimPlaying ? 'cursor: pointer;' : 'cursor: auto;'}
      on:click={skipDescAnim}
      role="presentation"
    >
      <button
        class="nodrag"
        on:click={() => {
          let submitDelete = true;
          dispatch('submit', [() => (submitDelete = false)]);
          if (submitDelete) dispatch('destroy');
        }}
      >
        <SvgIcon type="done" color="white" />
      </button>
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
      word-wrap: break-word;
      white-space: break-spaces;
      max-width: 50vw;
      max-height: 40vw;
      overflow-y: auto;
    }

    div.submit {
      display: flex;
      justify-content: flex-end;
      padding: 6px;

      button {
        height: 32px;
        width: 32px;
        border-radius: 4px;
        cursor: pointer;
        transition: all ease 0.5s;
        background-color: transparent;
        border: none;
        padding: 4px;

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
