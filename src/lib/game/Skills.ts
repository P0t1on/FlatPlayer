export type SkillType<T extends ModuleTypes> = {
  name: string;
  description: string;
  sideEffect: () => void;
  cost: number;
} & T;

export type ModuleTypes =
  | AttackModule
  | DefenseModule
  | BuffModule
  | Specialmodule;

export type AttackModule = {
  type: 'attack';
  power: number;
};

export type DefenseModule = {
  type: 'defense';
  power: number;
  evade: boolean;
  counter: boolean;
};

export type BuffModule = {
  type: 'buff';
  power: number;
};

export type Specialmodule = {
  type: 'etc';
};

type ModuleNames = 'attack' | 'buff' | 'defense' | 'etc';

type ModuleProps = {
  attack: {};
  buff: {};
  defense: {};
  etc: {};
};

type moduleRegisterReturns = {};

export function registerSkill<T extends ModuleTypes>(skillData: SkillType<T>) {
  switch (skillData.type) {
    case 'attack': {
      break;
    }

    case 'buff': {
      break;
    }

    case 'defense': {
      break;
    }

    case 'etc': {
      break;
    }
  }
}
