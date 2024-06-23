import { writable, type Writable } from 'svelte/store';

export type SkillType = {
  name: string;
} & (
  | {
      type: 'attack';
      power: number;
    }
  | {
      type: 'bless';
      positive: boolean;
    }
  | {
      type: 'defense';
      power: number;
      evade: boolean;
      counter: boolean;
    }
  | {
      type: 'special';
    }
);

export type EntityType = {
  name: Writable<string>;
  level: Writable<number>;
  stamina: {
    max: Writable<number>;
    current: Writable<number>;
  };
  stellarWill: {
    max: Writable<number>;
    current: Writable<number>;
  };
  atk: Writable<number>;
  speed: Writable<number>;
  status: { [key: string]: Writable<number> };
  description: string;
  skillset: [SkillType?, SkillType?, SkillType?, SkillType?];
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
  atk?: number;
  speed?: number;
  status?: { [key: string]: number };
  description?: string;
  skillset?: [SkillType?, SkillType?, SkillType?, SkillType?];
}): EntityType {
  let hp = {
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

  if (status !== undefined) {
    for (const id in status) {
      buff[id] = writable(status[id]);
    }
  }

  return {
    name: writable(name),
    level: writable(level !== undefined ? level : 1),
    stamina: hp,
    atk: writable(atk !== undefined ? atk : 1),
    speed: writable(speed !== undefined ? speed : 1),
    status: buff,
    description: description !== undefined ? description : '',
    skillset,
  };
}
