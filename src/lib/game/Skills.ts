export type SkillType<T extends keyof SkillModuleTypes> = {
  name: string;
  description: string;
  sideEffect: () => void;
  cost: number;
} & SkillModuleTypes[T];

export type SkillModuleTypes = {
  attack: AttackModule;
  buff: BuffModule;
  defense: DefenseModule;
  etc: Specialmodule;
};

export type AttackModule = {
  type: 'attack';
  power: number;
};

export type BuffModule = {
  type: 'buff';
  power: number;
};

export type DefenseModule = {
  type: 'defense';
  power: number;
  evade: boolean;
  counter: boolean;
};

export type Specialmodule = {
  type: 'etc';
};

type ModuleProps = {
  attack: {};
  buff: {};
  defense: {};
  etc: {};
};

export function createSkill<T extends keyof SkillModuleTypes>(
  type: T,
  skillProps: ModuleProps[T]
) {
  let result: SkillType<keyof SkillModuleTypes>;

  switch (type) {
    case 'attack': {
      result = false as unknown as SkillType<'attack'>;
      break;
    }
    case 'buff': {
      result = 1 as unknown as SkillType<'buff'>;
      break;
    }
    case 'defense': {
      result = '1' as unknown as SkillType<'defense'>;
      break;
    }
    case 'etc': {
      result = '' as unknown as SkillType<'etc'>;
      break;
    }

    default: {
      throw 'skill type is not defined';
    }
  }

  return result as SkillType<T>;
}

const test = createSkill('buff', {});
