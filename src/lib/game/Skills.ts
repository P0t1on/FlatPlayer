import type { EntityInstanceType } from './Entity';

export type SkillType<T extends keyof SkillModuleTypes> = {
  name: string;
  description: string;
  sideEffect(user: EntityInstanceType, ...target: EntityInstanceType[]): void;
  cost: number;
  restoreTurn: number;
  prepareTurn: number;
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

type DefaultModuleProp = {
  name?: string;
  description?: string;
  sideEffect?(user: EntityInstanceType, ...target: EntityInstanceType[]): void;
  cost?: number;
  restoreTurn?: number;
  prepareTurn?: number;
};

type ModuleProps = {
  attack: {
    power?: number;
  };
  buff: {
    power?: number;
  };
  defense: {
    power?: number;
    evade?: boolean;
    counter?: boolean;
  };
  etc: {};
};

export function createSkill<T extends keyof SkillModuleTypes>(
  type: T,
  skillProps: ModuleProps[T] & DefaultModuleProp
) {
  let { name, description, sideEffect, cost, restoreTurn, prepareTurn } =
      skillProps,
    result: SkillModuleTypes[T];

  name = name !== undefined ? name : type + 'Skill';
  description =
    description !== undefined
      ? description
      : `${type} skill description. but, this skill have no more description.`;
  sideEffect =
    sideEffect !== undefined
      ? sideEffect
      : () =>
          console.log(`${type} skill [${name}] used. but, nothing happened.`);
  cost = cost !== undefined ? cost : 1;
  restoreTurn = restoreTurn !== undefined ? restoreTurn : 1;
  prepareTurn = prepareTurn !== undefined ? prepareTurn : 0;

  const skillBase = {
    name,
    description,
    sideEffect,
    cost,
    restoreTurn,
    prepareTurn,
  };

  // ㅋㅋ
  switch (type) {
    case 'attack': {
      let { power } = skillProps as ModuleProps['attack'];

      power = power !== undefined ? power : 1;

      result = {
        type: 'attack',
        power,
      } as SkillModuleTypes['attack'] as any;
      break;
    }
    case 'buff': {
      let { power } = skillProps as ModuleProps['buff'];

      power = power !== undefined ? power : 1;

      result = {
        type: 'buff',
        power,
      } as SkillModuleTypes['buff'] as any;
      break;
    }
    case 'defense': {
      let { power, evade, counter } = skillProps as ModuleProps['defense'];

      power = power !== undefined ? power : 1;
      evade = evade !== undefined ? evade : false;
      counter = counter !== undefined ? counter : false;

      result = {
        type: 'defense',
        power,
        evade,
        counter,
      } as SkillModuleTypes['defense'] as any;
      break;
    }
    case 'etc': {
      let {} = skillProps as ModuleProps['etc'];
      result = {
        type: 'etc',
      } as SkillModuleTypes['etc'] as any;
      break;
    }

    default: {
      throw 'skill type is not defined';
    }
  }
  return Object.assign(result, skillBase);
}
