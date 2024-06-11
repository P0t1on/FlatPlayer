<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  import DialogBase from './DialogBase.svelte';

  export let title: string,
    description: string,
    zIndex: number,
    menu: string[],
    canIgnore: boolean,
    textSpeed = 25;

  let renderMenus: [string, string | undefined][],
    descAnim: NodeJS.Timeout,
    isDescAnimPlaying = true,
    readySelection = false;

  let descDiv: HTMLDivElement;

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void, number];
  }>();

  function submit(index: number) {
    return function () {
      if (isDescAnimPlaying) return;

      let preventDefault = false;
      dispatch('submit', [() => (preventDefault = true), index]);

      if (!preventDefault) dispatch('destroy');
    };
  }

  function skipDescAnim() {
    isDescAnimPlaying = false;
    if (descAnim) clearInterval(descAnim);
    descDiv.innerText = description;
    readySelection = true;
  }

  function onKeyDown(
    e: KeyboardEvent & {
      currentTarget: EventTarget & Document;
    }
  ) {
    if (e.keyCode === 32) skipDescAnim();
  }

  onMount(() => {
    {
      descDiv.innerText = description;
      descDiv.style.width = descDiv.offsetWidth + 'px';
      descDiv.style.height = descDiv.offsetHeight + 'px';
      descDiv.innerText = '';
    }

    let i = 0,
      m = description.length;
    descAnim = setInterval(() => {
      if (!isDescAnimPlaying) return;
      descDiv.innerText += description[i];
      i++;
      if (i >= m) {
        skipDescAnim();
      }
    }, textSpeed);

    const even = menu.length % 2 === 0,
      length = Math.ceil(menu.length / 2);
    renderMenus = Array.from({ length }, (_, i) => {
      return [
        menu[i * 2],
        i !== length - 1 || even ? menu[i * 2 + 1] : undefined,
      ];
    }) as [string, string | undefined][];
  });
</script>

<svelte:document on:keydown={onKeyDown} />

<DialogBase
  {...{ title, zIndex, canIgnore, overrideContent: true }}
  on:focus={() => dispatch('focus')}
  on:destroy={() => dispatch('destroy')}
>
  <div
    slot="content"
    on:click={skipDescAnim}
    role="presentation"
    style={isDescAnimPlaying ? 'cursor: pointer;' : 'cursor: auto;'}
  >
    <div class="desc" bind:this={descDiv} />
    {#if renderMenus !== undefined}
      <div class="selection">
        <div>
          {#each renderMenus as [a], i}
            <button class:ready={readySelection} on:click={submit(i * 2)}>
              {a}
            </button>
          {/each}
        </div>
        <div>
          {#each renderMenus as [_, b], i}
            {#if b !== undefined}
              <button class:ready={readySelection} on:click={submit(i * 2 + 1)}>
                {b}
              </button>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  </div>
</DialogBase>

<style lang="scss" module>
  div.desc {
    padding: 6px;
    word-wrap: break-word;
    white-space: break-spaces;
  }

  div.selection {
    display: flex;
    padding: 4px;

    div {
      list-style: none;
      padding: 0;
      margin: 24px 4px 4px 4px;
      width: 100%;

      button {
        cursor: pointer;
        text-align: center;
        transition: all ease 0.5s;

        opacity: 30%;
        color: white;
        background-color: transparent;
        border: 1px solid white;
        border-radius: 4px;
        padding: 6px 2px 6px 2px;
        margin: 4px 0 4px 0;
        width: 100%;

        &.ready {
          opacity: 100%;

          &:hover {
            box-shadow: white 0 0 8px 2px;
            cursor: pointer;

            &:active {
              box-shadow: none;
              background-color: white;
              color: black;
            }
          }
        }
      }
    }
  }
</style>
