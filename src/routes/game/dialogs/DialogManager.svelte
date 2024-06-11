<script lang="ts">
  import type {
    DialogContext,
    DialogManagerType,
    DialogType,
  } from '$lib/game/Dialogs';
  import type { Writable } from 'svelte/store';
  import MessageDialog from './MessageDialog.svelte';
  import SelectionDialog from './SelectionDialog.svelte';
  import MessagePageDialog from './MessagePageDialog.svelte';

  export let pauseLevel: Writable<number>, managerDiv: HTMLElement;

  let activeDialogs: DialogType[] = [];

  export const manager: DialogManagerType = {
    show(context: DialogContext) {
      const { canIgnore, pauseGame } = context,
        zIndex = activeDialogs.length + 500,
        pause = pauseGame !== undefined ? pauseGame : false;
      let element: DialogType;

      if (pause) {
        pauseLevel.update((v) => v + 1);
      }

      switch (context.type) {
        case 'message': {
          const { title, onSubmit, description } = context;
          let e = new MessageDialog({
            target: managerDiv,
            props: {
              zIndex,
              title: title ?? '',
              description: description ?? '',
              canIgnore: canIgnore ?? true,
            },
          });

          e.$on('submit', ({ detail }) => onSubmit?.(...detail));

          element = e;

          break;
        }

        case 'selection': {
          const { title, onSubmit, description, menu } = context;
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

          e.$on('submit', ({ detail }) => onSubmit?.(...detail));

          element = e;

          break;
        }

        case 'messagePage': {
          const { onSubmit, onPageChange, messageList } = context;

          const e = new MessagePageDialog({
            target: managerDiv,
            props: {
              zIndex,
              messageList,
              canIgnore: canIgnore ?? true,
            },
          });

          e.$on('submit', ({ detail }) => onSubmit?.(...detail));
          e.$on('pageChange', ({ detail }) => onPageChange?.(detail));
          element = e;
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

        if (pause) pauseLevel.update((v) => (v > 0 ? v - 1 : v));
        element.$destroy();
        this.sort();
      });

      let resolver: (args: any[]) => void;

      element.$on('submit', ({ detail: [_, ...args] }) => {
        resolver?.(args);
      });

      activeDialogs.push(element);

      return Object.assign(
        new Promise<any[]>((res) => (resolver = res)),
        element
      );
    },
    sort() {
      for (let i = 0; i < activeDialogs.length; i++) {
        const dialog = activeDialogs[i] as DialogType;

        dialog.$set({ zIndex: 500 + i });
      }
    },
  };
</script>

<slot id="dialogManager"></slot>

<style lang="scss" module>
</style>
