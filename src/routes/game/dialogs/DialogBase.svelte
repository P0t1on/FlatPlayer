<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { icon } from '$lib/Util';

  export let dialogID: string;

  let main: HTMLElement,
    closer: HTMLImageElement,
    isDrag = false,
    x = 0,
    y = 0;

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void];
  }>();

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

<article id={dialogID} class:dialogBase={dialogID ? false : true}>
  <slot name="tab">
    <div class="tab" on:mousedown={down} role="presentation">
      <img
        class="nodrag"
        bind:this={closer}
        alt="close"
        src={icon('close')}
        on:click={() => dispatch('destroy')}
        role="presentation"
      />
    </div>
  </slot>
  <slot name="description">
    <div class="desc">sample text</div>
  </slot>
  <slot name="interaction">
    <div class="submit">
      <img
        class="nodrag"
        alt="submit"
        src={icon('done')}
        on:click={() => {
          let submitDelete = true;
          dispatch('submit', [() => (submitDelete = false)]);
          if (submitDelete) dispatch('destroy');
        }}
        role="presentation"
      />
    </div>
  </slot>
</article>

<style lang="scss" module>
</style>
