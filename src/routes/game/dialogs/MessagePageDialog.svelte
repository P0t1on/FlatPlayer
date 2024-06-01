<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import DialogBase from './DialogBase.svelte';

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    pageChange: number;
    submit: [() => void];
  }>();

  export let title: string,
    description: string[],
    zIndex: number,
    canIgnore: boolean;

  let pageIndex = 0,
    descAnim: NodeJS.Timeout,
    isDescAnimPlaying = true;
  // bindings
  let desc: HTMLDivElement;

  function skipDescAnim() {
    isDescAnimPlaying = false;
    if (descAnim) clearInterval(descAnim);
    desc.innerText = description[pageIndex] as string;
  }

  function changePage(index: number) {
    pageIndex = index;
  }

  onMount(() => {
    {
      let w = 0,
        h = 0;
      for (const text of description) {
        desc.innerText = text;
        w = Math.max(w, desc.offsetWidth);
        h = Math.max(h, desc.offsetHeight);
      }

      desc.style.width = w + 'px';
      desc.style.height = h + 'px';
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
  on:keydown={(e) => {
    if (e.keyCode === 32) skipDescAnim();
  }}
/>

<DialogBase
  {...{ title, zIndex, canIgnore }}
  on:destroy={() => dispatch('destroy')}
  on:focus={() => dispatch('focus')}
>
  <div slot="content">
    <div
      class="desc"
      bind:this={desc}
      on:click={skipDescAnim}
      role="presentation"
    />
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
</style>
