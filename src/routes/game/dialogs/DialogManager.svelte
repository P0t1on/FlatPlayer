<script lang="ts">
  import type { DialogContext } from '$lib/game/basement';
  import {
    createEventDispatcher,
    type ComponentType,
    SvelteComponent,
  } from 'svelte';
  import { getUid } from '$lib/Util';
  import MsgDialog from './MsgDialog.svelte';
  import SelectionDialog from './SelectionDialog.svelte';

  const dispatch = createEventDispatcher<{
    onPause: CustomEvent<any>;
  }>();

  let managerDiv: HTMLDivElement,
    updateTrigger = true,
    highestZIndex = 0,
    activeDialogs: {
      [key: number]: {
        element: SvelteComponent<{
          zIndex: number;
        }>;
      };
    } = {};

  export const manager = {
    show(context: DialogContext) {
      const { title, description, canIgnore } = context,
        uid = getUid();
      let element: SvelteComponent;

      switch (context.type) {
        case 'message': {
          const { onSubmit } = context;
          element = new MsgDialog({
            target: managerDiv,
            props: {
              zIndex: highestZIndex + 1,
              title,
              description,
              canIgnore,
              onSubmit,
            },
          });

          highestZIndex += 1;
          break;
        }

        case 'selection': {
          const { onSubmit, menu } = context;
          element = new SelectionDialog({ target: managerDiv });
          highestZIndex += 1;
          break;
        }
      }

      activeDialogs[uid] = {
        element,
      };
    },
    sort() {
      updateTrigger = !updateTrigger;
    },
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
