<script lang="ts">
  import type {
    DialogContext,
    DialogManagerType,
    DialogType,
  } from '$lib/game/basement';
  import { createEventDispatcher } from 'svelte';
  import MessageDialog from './MessageDialog.svelte';
  import SelectionDialog from './SelectionDialog.svelte';

  const dispatch = createEventDispatcher<{
    pause: boolean;
  }>();

  let managerDiv: HTMLSpanElement,
    activeDialogs: DialogType[] = [];

  export const manager: DialogManagerType = {
    show(context: DialogContext) {
      const { title, description, canIgnore } = context,
        zIndex = activeDialogs.length + 1;
      let element: DialogType;

      switch (context.type) {
        case 'message': {
          const { onSubmit } = context;
          let e = new MessageDialog({
            target: managerDiv,
            props: {
              zIndex,
              title: title ?? '',
              description: description ?? '',
              canIgnore: canIgnore ?? true,
            },
          });

          e.$on('submit', (e) => onSubmit?.(...e.detail));

          element = e;

          break;
        }

        case 'selection': {
          const { onSubmit, menu } = context;
          const e = new SelectionDialog({
            target: managerDiv,
            props: {
              zIndex,
              title: title ?? '',
              description: description ?? '',
              menu,
              canIgnore: canIgnore ?? true,
            },
          });

          e.$on('submit', (e) => onSubmit?.(...e.detail));

          element = e;

          break;
        }
      }

      element.$on('focus', () => {
        activeDialogs.forEach((dialog, i, list) => {
          if (dialog === element) {
            list.splice(i, 1);
          }
        });

        activeDialogs.push(element);
        this.sort();
      });

      element.$on('destroy', () => {
        activeDialogs.forEach((dialog, i, list) => {
          if (dialog === element) {
            list.splice(i, 1);
          }
        });

        element.$destroy();
        this.sort();
      });

      if (!canIgnore) {
        dispatch('pause', true);
      }

      activeDialogs.push(element);

      return element;
    },
    sort() {
      for (let i = 0; i < activeDialogs.length; i++) {
        const dialog = activeDialogs[i] as DialogType;

        dialog.$set({ zIndex: i });
      }
    },
  };
</script>

<span id="dialogManager" bind:this={managerDiv}></span>

<style lang="scss" module>
</style>
