<script lang="ts">
  import SvgIcon from '$lib/SVGIcon.svelte';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void];
  }>();

  export let title: string = '',
    description = '',
    zIndex: number,
    canIgnore = true,
    overrideContent = false,
    textSpeed = 25;

  let main: HTMLDialogElement,
    closer: HTMLSpanElement,
    desc: HTMLDivElement,
    isDescAnimPlaying = true,
    isDrag = false,
    descAnim: NodeJS.Timeout,
    x = 0,
    y = 0,
    readySubmit = false;

  function skipDescAnim() {
    if (overrideContent) return;
    readySubmit = true;
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

  function onKeyDown(
    e: KeyboardEvent & {
      currentTarget: EventTarget & Document;
    }
  ) {
    if (e.keyCode === 32) skipDescAnim();
  }

  export function submit() {
    if (isDescAnimPlaying) {
      skipDescAnim();
    } else {
      let close = true;
      dispatch('submit', [() => (close = false)]);
      if (close) dispatch('destroy');
    }
  }

  onMount(() => {
    if (!overrideContent) {
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
        if (i >= m) skipDescAnim();
      }, textSpeed);
    }
  });
</script>

<svelte:document on:mousemove={move} on:mouseup={up} on:keydown={onKeyDown} />

<dialog
  bind:this={main}
  on:mousedown={() => dispatch('focus')}
  role="presentation"
  open
>
  <slot name="tab">
    <div class="tab" on:mousedown={tabMouseDown} role="presentation">
      <span>{title}&nbsp;</span>
      {#if canIgnore}
        <button
          class="nodrag"
          bind:this={closer}
          on:click={() => dispatch('destroy')}
        >
          <SvgIcon type="close" color="white" />
        </button>
      {/if}
    </div>
  </slot>
  <slot name="content">
    <div
      class="desc"
      bind:this={desc}
      on:click={skipDescAnim}
      role="presentation"
    />
    <div
      class="interactions"
      on:click={skipDescAnim}
      style={isDescAnimPlaying ? 'cursor: pointer;' : 'cursor: auto;'}
      role="presentation"
    >
      <button class:ready={readySubmit} class="nodrag" on:click={submit}>
        <SvgIcon type="done" color="white" />
      </button>
    </div>
  </slot>
</dialog>

<style lang="scss" module>
  dialog {
    position: absolute;
    background-color: black;
    color: white;

    top: 30%;
    left: 40%;
    min-width: 100px;
    z-index: bind(zIndex);

    padding: 0;
    margin: 0;
    border-radius: 8px;
    outline: 4px double white;
    border: none;

    user-select: none;

    div.tab {
      display: flex;
      justify-content: space-between;

      border: 4px double white;
      border-radius: 8px 8px 0 0;
      padding: 4px 8px 4px 8px;
      min-width: 12vw;
      background-color: black;

      button {
        padding: 0;
        height: 24px;
        width: 24px;
        cursor: pointer;
        transition: all ease 0.5s;

        border: none;
        border-radius: 4px;
        background-color: transparent;

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

    div.interactions {
      display: flex;
      justify-content: flex-end;
      padding: 6px;

      button {
        transition: all ease 0.5s;
        height: 32px;
        width: 32px;
        border-radius: 4px;
        cursor: pointer;
        background-color: transparent;
        border: none;
        padding: 4px;
        opacity: 30%;

        &.ready {
          opacity: 100%;
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
  }
</style>
