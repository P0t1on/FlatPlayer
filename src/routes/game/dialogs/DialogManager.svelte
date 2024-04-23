<script lang="ts">
  import type { DialogContext } from '$lib/game/basement';
  import { createEventDispatcher } from 'svelte';
  import MsgDialog from './MsgDialog.svelte';
  import SelectionDialog from './SelectionDialog.svelte';

  const dispatch = createEventDispatcher<{
    onPause: CustomEvent;
  }>();

  let managerDiv: HTMLDivElement,
    activeDialogs: {
      element: HTMLElement;
    }[] = [];

  export const manager = {
    show(context: DialogContext) {
      const { title, description, canIgnore } = context;
      switch (context.type) {
        case 'message': {
          break;
        }

        case 'selection': {
          break;
        }
      }
    },
    sort() {},
  };
</script>

<div id="manager" bind:this={managerDiv}></div>

<style lang="scss" module>
  div#manager {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
