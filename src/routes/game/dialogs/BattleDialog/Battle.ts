import { EventManager } from '$lib/Util';
import type { EntityInstanceType, EntityTeamType } from '$lib/game/Entity';
import type { SkillModuleTypes, SkillType } from '$lib/game/Skills';
import { writable } from 'svelte/store';

export class Battle {
  public events = new EventManager<{
    death: EntityInstanceType;
    finish: EntityTeamType;
  }>();

  public constructor(
    public aTeam: EntityTeamType,
    public bTeam: EntityTeamType
  ) {}

  public apply(
    target: EntityInstanceType,
    property: { hp?: number; sp?: number; status?: { [key: string]: number } }
  ) {
    const { hp, sp, status } = property;

    if (hp !== undefined) target.hp.current.update((v) => v + (hp as number));
    if (sp !== undefined) target.sp.current.update((v) => v + (sp as number));

    if (status !== undefined) {
      for (const key in status) {
        const val = status[key] as number;

        let targetSt = target.status[key];

        if (targetSt === undefined) {
          targetSt = target.status[key] = writable(val);
        } else {
          targetSt.update((v) => v + val);
        }
      }
    }
  }

  public getTargetList(
    user: EntityInstanceType,
    userTeam: EntityTeamType,
    targetTeam: EntityTeamType,
    skill?: SkillType<keyof SkillModuleTypes>
  ) {
    const result = new Set<0 | 1 | 2 | 3 | 4>();

    userTeam.findIndex((v) => v === user);
    return result;
  }

  public useSkill(
    user: EntityInstanceType,
    skill?: SkillType<keyof SkillModuleTypes>,
    ...target: EntityInstanceType[]
  ): void {
    if (skill === undefined) return;

    skill.sideEffect(user, ...target);
  }
}
