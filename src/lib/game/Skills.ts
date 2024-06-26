export type SkillType<T extends ModuleTypes> = {
  name: string;
  description: string;
  sideEffect: () => void;
} & T;

export type ModuleTypes =
  | AttackModule
  | DefenseModule
  | BlessModule
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

export type BlessModule = {
  type: 'bless';
  power: number;
};

export type Specialmodule = {
  type: 'special';
};

export function registerSkill<T extends ModuleTypes>(skillData: SkillType<T>) {
  switch (skillData.type) {
    case 'attack': {
      break;
    }
  }
}
