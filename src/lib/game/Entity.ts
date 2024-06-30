import { writable, type Writable } from 'svelte/store';
import type { ModuleTypes, SkillType } from './Skills';

export class Entity {
  public readonly status: {
    hp: number;
    sp: number;
    atk: number;
    def: number;
    speed: number;
  };

  public constructor(
    public name: string,
    public description: string = '',
    status: {
      hp?: number;
      sp?: number;
      atk?: number;
      def?: number;
      speed?: number;
    } = {},
    public skillset: SkillSetType = [, , ,]
  ) {
    const { hp, sp, atk, def, speed } = status;

    this.status = {
      hp: hp ?? 10,
      sp: sp ?? 10,
      atk: atk ?? 1,
      def: def ?? 1,
      speed: speed ?? 1,
    };
  }

  public instantiate({
    level,
    hp,
    sp,
    status,
  }: {
    level?: number;
    hp?: number;
    sp?: number;
    status?: { [key: string]: Writable<number> };
  } = {}): EntityInstanceType {
    let { hp: maxHp, sp: maxSp, atk, def, speed } = this.status;

    level = level !== undefined ? level : 1;

    maxHp = maxHp * (2 ^ level);
    hp = hp !== undefined ? (hp > maxHp ? maxHp : hp) : maxHp;

    maxSp = maxSp * (2 ^ level);
    sp = sp !== undefined ? (sp > maxSp ? maxSp : sp) : maxSp;

    return {
      name: this.name,
      description: this.description,
      level: writable(level),
      hp: {
        max: writable(maxHp),
        current: writable(hp),
      },
      sp: {
        max: writable(sp * (2 ^ level)),
        current: writable(sp * (2 ^ level)),
      },
      atk: writable(atk * (2 ^ level)),
      def: writable(def * (2 ^ level)),
      speed: writable(speed + level),
      status: status !== undefined ? status : {},
      skillset: [...this.skillset],
    };
  }
}

export type EntityInstanceType = {
  name: string;
  description: string;
  level: Writable<number>;
  hp: {
    max: Writable<number>;
    current: Writable<number>;
  };
  sp: {
    max: Writable<number>;
    current: Writable<number>;
  };
  atk: Writable<number>;
  def: Writable<number>;
  speed: Writable<number>;
  status: { [key: string]: Writable<number> };
  skillset: SkillSetType;
};

export type SkillSetType = [
  SkillType<ModuleTypes>?,
  SkillType<ModuleTypes>?,
  SkillType<ModuleTypes>?,
  SkillType<ModuleTypes>?
];

export type EntityTeamType = [
  EntityInstanceType,
  EntityInstanceType?,
  EntityInstanceType?,
  EntityInstanceType?,
  EntityInstanceType?,
  EntityInstanceType?,
  EntityInstanceType?,
  EntityInstanceType?,
  EntityInstanceType?,
  EntityInstanceType?
];
