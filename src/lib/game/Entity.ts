import { writable, type Writable } from 'svelte/store';
import type { SkillModuleTypes, SkillType } from './Skills';

export class Entity {
  public readonly status: {
    hp: number;
    sp: number;
    atk: number;
    def: number;
    speed: number;
  };
  public skillset: SkillSetType;

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
    skillset: SkillSetType = [, , ,]
  ) {
    const { hp, sp, atk, def, speed } = status;

    this.status = {
      hp: hp ?? 10,
      sp: sp ?? 10,
      atk: atk ?? 1,
      def: def ?? 1,
      speed: speed ?? 1,
    };
    this.skillset = skillset;
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

    maxHp = maxHp * 2 ** (level - 1);
    hp = hp !== undefined ? (hp > maxHp ? maxHp : hp) : maxHp;

    maxSp = maxSp * 2 ** (level - 1);
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
        max: writable(maxSp),
        current: writable(sp),
        assigned: [],
      },
      atk: writable(atk * 2 ** level),
      def: writable(def * 2 ** level),
      speed: writable(speed + level),
      status: status !== undefined ? status : {},
      skillset: [...this.skillset],
    };
  }
}

export type EntityInstanceType<
  S1 extends keyof SkillModuleTypes = keyof SkillModuleTypes,
  S2 extends keyof SkillModuleTypes = keyof SkillModuleTypes,
  S3 extends keyof SkillModuleTypes = keyof SkillModuleTypes,
  S4 extends keyof SkillModuleTypes = keyof SkillModuleTypes
> = {
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
    assigned: {
      reason: Symbol;
      turn: number;
      amount: number;
    }[];
  };
  atk: Writable<number>;
  def: Writable<number>;
  speed: Writable<number>;
  status: { [key: string]: Writable<number> };
  skillset: SkillSetType<S1, S2, S3, S4>;
};

export type SkillSetType<
  S1 extends keyof SkillModuleTypes = keyof SkillModuleTypes,
  S2 extends keyof SkillModuleTypes = keyof SkillModuleTypes,
  S3 extends keyof SkillModuleTypes = keyof SkillModuleTypes,
  S4 extends keyof SkillModuleTypes = keyof SkillModuleTypes
> = [SkillType<S1>?, SkillType<S2>?, SkillType<S3>?, SkillType<S4>?];

export type EntityTeamType = [
  EntityInstanceType,
  EntityInstanceType?,
  EntityInstanceType?,
  EntityInstanceType?,
  EntityInstanceType?
];
