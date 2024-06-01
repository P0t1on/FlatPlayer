<script lang="ts">
  import type {
    DialogContext,
    DialogManagerType,
    DialogType,
  } from '$lib/game/Dialogs';
  import type { Writable } from 'svelte/store';
  import MessageDialog from './MessageDialog.svelte';
  import SelectionDialog from './SelectionDialog.svelte';

  export let pauseLevel: Writable<number>;

  let managerDiv: HTMLSpanElement,
    activeDialogs: DialogType[] = [];

  export const manager: DialogManagerType = {
    show(context: DialogContext) {
      const { title, description, canIgnore, pauseGame } = context,
        zIndex = activeDialogs.length + 500,
        pause = pauseGame !== undefined ? pauseGame : false;
      let element: DialogType;

      if (pause) {
        pauseLevel.update((v) => v + 1);
      }

      switch (context.type) {
        case 'message': {
          const { onSubmit } = context;
          let e = new MessageDialog({
            target: managerDiv,
            props: {
              zIndex,
              title: title ?? false,
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

        pauseLevel.update((v) => (v > 0 ? v - 1 : v));
        element.$destroy();
        this.sort();
      });

      activeDialogs.push(element);

      return element;
    },
    sort() {
      for (let i = 0; i < activeDialogs.length; i++) {
        const dialog = activeDialogs[i] as DialogType;

        dialog.$set({ zIndex: 500 + i });
      }
    },
  };
</script>

<span id="dialogManager" bind:this={managerDiv}></span>

<style lang="scss" module>
</style>
