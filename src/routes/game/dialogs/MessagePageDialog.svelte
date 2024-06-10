<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import DialogBase from './DialogBase.svelte';
  import SvgIcon from '$lib/SVGIcon.svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    pageChange: number;
    submit: [() => void];
  }>();

  export let messageList: [string, string][],
    zIndex: number,
    canIgnore: boolean,
    textSpeed = 25;

  let description = '',
    pageIndex = 0,
    isDescAnimPlaying = true,
    canPrev = false,
    canNext = false,
    readyDone = false;
  let anim_i = 0,
    anim_m = 0;

  // bindings
  let descDiv: HTMLDivElement, interactionsDiv: HTMLDivElement;
  let submit: () => void;

  function skipDescAnim() {
    isDescAnimPlaying = false;
    descDiv.innerText = (messageList[pageIndex] as [string, string])[1];
    readyDone = pageIndex === messageList.length - 1;
    canPrev = pageIndex > 0;
    canNext = pageIndex < messageList.length - 1;

    anim_i = 0;
  }

  function changePage(index: number) {
    if (
      descDiv !== undefined &&
      pageIndex !== index &&
      index > -1 &&
      index < messageList.length
    ) {
      pageIndex = index;
      description = (messageList[index] as [string, string])[1];
      anim_m = description.length;
      descDiv.innerHTML = '';
      isDescAnimPlaying = true;

      canPrev = canNext = readyDone = false;
    }
  }

  function onKeyDown(
    e: KeyboardEvent & {
      currentTarget: EventTarget & Document;
    }
  ) {
    if (e.keyCode === 32) {
      if (isDescAnimPlaying) skipDescAnim();
      else changePage(pageIndex + 1);
    }
  }

  $: {
    if (descDiv !== undefined)
      descDiv.style.cursor = isDescAnimPlaying ? 'pointer' : 'auto';
  }

  onMount(() => {
    description = (messageList[pageIndex] as [string, string])[1];

    {
      let w = 0,
        h = 0;
      for (const [_, text] of messageList) {
        descDiv.innerText = text;
        w = Math.max(w, descDiv.offsetWidth);
        h = Math.max(h, descDiv.offsetHeight);
      }

      descDiv.style.width = w + 'px';
      descDiv.style.height = h + 'px';
      descDiv.innerText = '';
    }

    anim_i = 0;
    anim_m = description.length;
    setInterval(() => {
      if (!isDescAnimPlaying) return;
      descDiv.innerText += description[anim_i];
      anim_i++;
      if (anim_i >= anim_m) {
        anim_i = 0;
        skipDescAnim();
      }
    }, textSpeed);
  });
</script>

<svelte:document on:keydown={onKeyDown} />

<DialogBase
  {...{ zIndex, canIgnore, overrideContent: true }}
  title={messageList[pageIndex]?.[0] ?? ''}
  bind:submit
  on:destroy={() => dispatch('destroy')}
  on:focus={() => dispatch('focus')}
  on:submit={({ detail }) => dispatch('submit', detail)}
>
  <div slot="content">
    <div
      class="desc"
      bind:this={descDiv}
      on:click={skipDescAnim}
      role="presentation"
    />

    <div
      class="interactions"
      style={isDescAnimPlaying ? 'cursor: pointer;' : 'cursor: auto;'}
      on:click={(e) => {
        if (e.target === interactionsDiv) skipDescAnim();
      }}
      bind:this={interactionsDiv}
      role="presentation"
    >
      <button
        class:ready={canPrev}
        style={isDescAnimPlaying || canPrev
          ? 'cursor: pointer;'
          : 'cursor: auto;'}
        tabindex="-1"
        on:click={() => {
          if (canPrev) changePage(pageIndex - 1);
          else skipDescAnim();
        }}
        on:keydown={(e) => e.preventDefault()}
      >
        <SvgIcon type="keyboard_arrow_left" />
      </button>
      <button
        class:ready={canNext}
        style={isDescAnimPlaying || canNext
          ? 'cursor: pointer;'
          : 'cursor: auto;'}
        tabindex="-1"
        on:click={() => {
          if (canNext) changePage(pageIndex + 1);
          else skipDescAnim();
        }}
        on:keydown={(e) => e.preventDefault()}
      >
        <SvgIcon type="keyboard_arrow_right" />
      </button>
      <button
        class:ready={readyDone}
        style={isDescAnimPlaying || readyDone
          ? 'cursor: pointer;'
          : 'cursor: auto;'}
        tabindex="-1"
        on:keydown={(e) => e.preventDefault()}
        on:click={submit}
      >
        <SvgIcon type="done" />
      </button>
    </div>
  </div>
</DialogBase>

<style lang="scss" module>
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

    padding: 0 4px 4px 0;

    button {
      transition: all ease 0.5s;

      opacity: 30%;
      background-color: transparent;

      margin: 4px;
      padding: 4px;
      width: 32px;
      height: 32px;
      border: none;

      &:focus-visible {
        outline: none;
      }

      &.ready {
        opacity: 100%;

        &:hover {
          box-shadow: 0 0 3px 3px gray;

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
