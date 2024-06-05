<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  import DialogBase from './DialogBase.svelte';

  export let title: string,
    description: string,
    zIndex: number,
    menu: string[],
    canIgnore: boolean;

  let renderMenus: [string, string | undefined][];

  const dispatch = createEventDispatcher<{
    focus: void;
    destroy: void;
    submit: [() => void, number];
  }>();

  function submit(index: number) {
    return function () {
      let preventDefault = false;
      dispatch('submit', [() => (preventDefault = true), index]);

      if (!preventDefault) dispatch('destroy');
    };
  }

  onMount(() => {
    const even = menu.length % 2 === 0,
      length = Math.ceil(menu.length / 2);
    renderMenus = Array.from({ length }, (_, i) => {
      console.log(i);
      return [
        menu[i * 2],
        i !== length - 1 || even ? menu[i * 2 + 1] : undefined,
      ];
    }) as [string, string | undefined][];
  });
</script>

<DialogBase
  {...{ title, zIndex, canIgnore, overrideContent: true }}
  on:focus={() => dispatch('focus')}
  on:destroy={() => dispatch('destroy')}
>
  <div slot="content">
    <div class="desc">{description}</div>
    {#if renderMenus !== undefined}
      <div class="selection">
        <div>
          {#each renderMenus as [a], i}
            <button on:click={submit(i * 2)}>{a}</button>
          {/each}
        </div>
        <div>
          {#each renderMenus as [_, b], i}
            {#if b !== undefined}
              <button on:click={submit(i * 2 + 1)}>{b}</button>
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
        text-align: center;
        color: white;
        background-color: transparent;
        border: 1px solid white;
        border-radius: 4px;
        padding: 6px 2px 6px 2px;
        margin: 4px 0 4px 0;
        width: 100%;

        &:hover {
          transition: all ease 0.5s;
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
</style>
