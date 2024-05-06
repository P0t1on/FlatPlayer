import type { SvelteComponent } from 'svelte';
import type DialogBase from '../../routes/game/dialogs/DialogBase.svelte';

export type LoggerType = {
  log(sender: string, msg: string): void;
  clear(): void;
  delete(index: number): void;
};

export type DialogContext = {
  title: string;
  description: string;
  canIgnore: boolean;
} & (
  | {
      type: 'message';
      onSubmit(preventDefault: () => void): void;
    }
  | {
      type: 'selection';
      menu: string[];
      onSubmit(preventDefault: () => void, selected: number): void;
    }
);

export type DialogType = SvelteComponent<
  { zIndex: number },
  {
    focus: CustomEvent<void>;
    destroy: CustomEvent<void>;
    submit: CustomEvent<[() => void, ...any[]]>;
  }
>;

export type DialogManagerType = {
  show(context: DialogContext): DialogType;
  sort(): void;
};
