<script lang="ts">
  import type { DialogContext } from '$lib/game/basement';
  import { createEventDispatcher, onMount, SvelteComponent } from 'svelte';
  import MsgDialog from './MsgDialog.svelte';
  import SelectionDialog from './SelectionDialog.svelte';

  const dispatch = createEventDispatcher<{
    pause: boolean;
  }>();

  type DialogType = SvelteComponent<
    { zIndex: number },
    {
      focus: CustomEvent<void>;
      destroy: CustomEvent<void>;
    }
  >;

  let managerDiv: HTMLDivElement,
    activeDialogs: DialogType[] = [];

  export const manager = {
    show(context: DialogContext) {
      const { title, description, canIgnore } = context,
        zIndex = activeDialogs.length;
      let element: DialogType;

      switch (context.type) {
        case 'message': {
          const { onSubmit } = context;
          element = new MsgDialog({
            target: managerDiv,
            props: {
              zIndex,
              title,
              description,
              canIgnore,
              onSubmit,
            },
          });

          break;
        }

        case 'selection': {
          const { onSubmit, menu } = context;
          element = new SelectionDialog({
            target: managerDiv,
            props: {
              zIndex,
              title,
              description,
              canIgnore,
              onSubmit,
              menu,
            },
          });
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

      activeDialogs.push(element);
    },
    sort() {
      for (let i = 0; i < activeDialogs.length; i++) {
        const dialog = activeDialogs[i] as DialogType;

        dialog.$set({ zIndex: i });
      }
    },
  };

  onMount(() => {
    manager.show({
      type: 'message',
      title: '',
      description: '',
      canIgnore: true,
      onSubmit() {
        console.log('YEE');
      },
    });
  });
</script>

<div id="manager" bind:this={managerDiv}></div>

<style lang="scss" module>
  div#manager {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
