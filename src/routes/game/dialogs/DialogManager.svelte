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
  import BattleDialog from './BattleDialog/BattleDialog.svelte';

  export let pauseLevel: Writable<number>, managerDiv: HTMLElement;

  let activeDialogs: DialogType[] = [];

  export const manager: DialogManagerType = {
    show(context: DialogContext) {
      const zIndex = activeDialogs.length + 500;
      let dialogRef: DialogType,
        pause = false;

      switch (context.type) {
        case 'message': {
          const { canIgnore, pauseGame, title, onSubmit, description } =
            context;
          pause = pauseGame !== undefined ? pauseGame : pause;
          let dialog = new MessageDialog({
            target: managerDiv,
            props: {
              zIndex,
              title: title ?? '',
              description: description ?? '',
              canIgnore: canIgnore ?? true,
            },
          });

          dialog.$on('submit', ({ detail }) => onSubmit?.(...detail));

          dialogRef = dialog;

          break;
        }

        case 'selection': {
          const { canIgnore, pauseGame, title, onSubmit, description, menu } =
            context;
          pause = pauseGame !== undefined ? pauseGame : pause;
          const dialog = new SelectionDialog({
            target: managerDiv,
            props: {
              zIndex,
              title: title ?? '',
              description: description ?? '',
              menu,
              canIgnore: canIgnore ?? true,
            },
          });

          dialog.$on('submit', ({ detail }) => onSubmit?.(...detail));

          dialogRef = dialog;

          break;
        }

        case 'messagePage': {
          const { canIgnore, pauseGame, onSubmit, onPageChange, messageList } =
            context;
          pause = pauseGame !== undefined ? pauseGame : pause;

          const dialog = new MessagePageDialog({
            target: managerDiv,
            props: {
              zIndex,
              messageList,
              canIgnore: canIgnore ?? true,
            },
          });

          dialog.$on('submit', ({ detail }) => onSubmit?.(...detail));
          dialog.$on('pageChange', ({ detail }) => onPageChange?.(detail));
          dialogRef = dialog;

          break;
        }

        case 'battle': {
          const { onSubmit, playerTeam, oppoTeam } = context;
          pause = true;

          const dialog = new BattleDialog({
            target: managerDiv,
            props: {
              zIndex,
              aTeam: playerTeam,
              bTeam: oppoTeam,
            },
          });

          dialog.$on('submit', ({ detail }) => onSubmit?.(...detail));

          dialogRef = dialog;
          break;
        }
      }

      if (pause) {
        pauseLevel.update((v) => v + 1);
      }

      dialogRef.$on('focus', () => {
        activeDialogs.forEach((dialog, i, list) => {
          if (dialog === dialogRef) {
            list.splice(i, 1);
          }
        });

        activeDialogs.push(dialogRef);
        this.sort();
      });

      dialogRef.$on('destroy', () => {
        activeDialogs.forEach((dialog, i, list) => {
          if (dialog === dialogRef) {
            list.splice(i, 1);
          }
        });

        if (pause) pauseLevel.update((v) => (v > 0 ? v - 1 : v));
        dialogRef.$destroy();
        this.sort();
      });

      let resolver: (args: any[]) => void;

      dialogRef.$on('submit', ({ detail: [_, ...args] }) => {
        resolver?.(args);
      });

      activeDialogs.push(dialogRef);

      return Object.assign(
        new Promise<any[]>((res) => (resolver = res)),
        dialogRef
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
