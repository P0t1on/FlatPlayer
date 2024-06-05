import type { SvelteComponent } from 'svelte';

export type LoggerType = {
  log(sender: string, msg: string): void;
  clear(): void;
  delete(index: number): void;
};

export type DialogContext = {
  title?: string;
  canIgnore?: boolean;
  pauseGame?: boolean;
} & (
  | {
      type: 'message';
      description?: string;
      onSubmit?(preventDefault: () => void): void;
    }
  | {
      type: 'messagePage';
      descriptions: string[];
      onPageChange?(index: number): void;
      onSubmit?(preventDefault: () => void): void;
    }
  | {
      type: 'selection';
      description?: string;
      menu: string[];
      onSubmit?(preventDefault: () => void, selected: number): void;
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
