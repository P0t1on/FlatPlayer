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
