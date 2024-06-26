import { writable, type Writable } from 'svelte/store';
import type { ModuleTypes, SkillType } from './Skills';

export type EntityType = {
  name: Writable<string>;
  level: Writable<number>;
  stamina: {
    max: Writable<number>;
    current: Writable<number>;
  };
  power: {
    max: Writable<number>;
    current: Writable<number>;
  };
  atk: Writable<number>;
  speed: Writable<number>;
  status: { [key: string]: Writable<number> };
  description: string;
  skillset: [
    SkillType<ModuleTypes>?,
    SkillType<ModuleTypes>?,
    SkillType<ModuleTypes>?,
    SkillType<ModuleTypes>?
  ];
};

export type EntityTeamType = [
  EntityType,
  EntityType?,
  EntityType?,
  EntityType?,
  EntityType?
];

export function createEntity({
  name,
  level,
  stamina,
  power,
  atk,
  speed,
  status,
  description,
  skillset,
}: {
  name: string;
  level?: number;
  stamina:
    | {
        max: number;
        current: number;
      }
    | number;
  power:
    | {
        max: number;
        current: number;
      }
    | number;
  atk?: number;
  speed?: number;
  status?: { [key: string]: number };
  description?: string;
  skillset?: [
    SkillType<ModuleTypes>?,
    SkillType<ModuleTypes>?,
    SkillType<ModuleTypes>?,
    SkillType<ModuleTypes>?
  ];
}): EntityType {
  let hp = {
      max: writable(1),
      current: writable(1),
    },
    stellar = {
      max: writable(1),
      current: writable(1),
    };
  skillset = skillset !== undefined ? skillset : [];

  const buff: { [key: string]: Writable<number> } = {};

  if (typeof stamina === 'number') {
    hp.max.set(stamina);
    hp.current.set(stamina);
  } else {
    hp.max.set(stamina.max);
    hp.current.set(stamina.current);
  }

  if (typeof power === 'number') {
    stellar.max.set(power);
    stellar.current.set(power);
  } else {
    stellar.max.set(power.max);
    stellar.current.set(power.current);
  }

  if (status !== undefined) {
    for (const id in status) {
      buff[id] = writable(status[id]);
    }
  }

  return {
    name: writable(name),
    level: writable(level !== undefined ? level : 1),
    stamina: hp,
    power: stellar,
    atk: writable(atk !== undefined ? atk : 1),
    speed: writable(speed !== undefined ? speed : 1),
    status: buff,
    description: description !== undefined ? description : '',
    skillset,
  };
}
