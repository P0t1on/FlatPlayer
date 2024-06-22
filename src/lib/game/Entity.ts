import { writable, type Writable } from 'svelte/store';

export type SkillType = {};

export type EntityType = {
  name: Writable<string>;
  level: Writable<number>;
  health: {
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
  health,
  atk,
  speed,
  status,
  description,
  skillset,
}: {
  name: string;
  level?: number;
  health:
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

  if (typeof health === 'number') {
    hp.max.set(health);
    hp.current.set(health);
  } else {
    hp.max.set(health.max);
    hp.current.set(health.current);
  }

  if (status !== undefined) {
    for (const id in status) {
      buff[id] = writable(status[id]);
    }
  }

  return {
    name: writable(name),
    level: writable(level !== undefined ? level : 1),
    health: hp,
    atk: writable(atk !== undefined ? atk : 1),
    speed: writable(speed !== undefined ? speed : 1),
    status: buff,
    description: description !== undefined ? description : '',
    skillset,
  };
}
