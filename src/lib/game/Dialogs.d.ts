import type { SvelteComponent } from 'svelte';
import type { EntityTeamType } from './Entity';

export type LoggerType = {
  log(sender: string, msg: string): void;
  clear(): void;
  delete(index: number): void;
};

export type BattleDialogReturnType =
  | {
      type: 'escape';
      entities: EntityTeamType;
    }
  | {
      type: 'win';
      entities: EntityTeamType;
      loots: { [key: string]: number };
    }
  | {
      type: 'lose';
      entities: EntityTeamType;
    };

export type DialogContext =
  | ({
      canIgnore?: boolean;
      pauseGame?: boolean;
    } & (
      | {
          type: 'message';
          title?: string;
          description?: string;
          onSubmit?(preventDefault: () => void): void;
        }
      | {
          type: 'messagePage';
          messageList: [string, string][];
          onPageChange?(index: number): void;
          onSubmit?(preventDefault: () => void): void;
        }
      | {
          type: 'selection';
          title?: string;
          description?: string;
          menu: string[];
          onSubmit?(preventDefault: () => void, selected: number): void;
        }
    ))
  | {
      type: 'battle';
      playerTeam: EntityTeamType;
      oppoTeam: EntityTeamType;
      onSubmit?(
        preventDefault: () => void,
        result: BattleDialogReturnType
      ): void;
    };

export type DialogType = SvelteComponent<
  { zIndex: number },
  {
    focus: CustomEvent<void>;
    destroy: CustomEvent<void>;
    submit: CustomEvent<[() => void, ...any[]]>;
  }
>;

export type DialogManagerType = {
  show(context: DialogContext): DialogType & Promise<any[]>;
  sort(): void;
};
