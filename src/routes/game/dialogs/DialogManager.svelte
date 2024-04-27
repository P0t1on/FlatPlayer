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
      submit: CustomEvent<[() => void, ...any[]]>;
    }
  >;

  let managerDiv: HTMLSpanElement,
    activeDialogs: DialogType[] = [];

  export const manager = {
    show(context: DialogContext) {
      const { title, description, canIgnore } = context,
        zIndex = activeDialogs.length + 1;
      let element: DialogType;

      switch (context.type) {
        case 'message': {
          const { onSubmit } = context;
          let e = new MsgDialog({
            target: managerDiv,
            props: {
              zIndex,
              title,
              description,
            },
          });

          e.$on('submit', (e) => onSubmit(...e.detail));

          element = e;

          break;
        }

        case 'selection': {
          const { onSubmit, menu } = context;
          const e = new SelectionDialog({
            target: managerDiv,
            props: {
              zIndex,
              title,
              description,
              menu,
            },
          });

          e.$on('submit', (e) => onSubmit(...e.detail));

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

  onMount(() => {
    manager.show({
      type: 'message',
      title: 'test',
      description: '설명',
      canIgnore: true,
      onSubmit() {
        console.log('YEE');
      },
    });
  });
</script>

<span id="dialogManager" bind:this={managerDiv}></span>

<style lang="scss" module>
</style>
