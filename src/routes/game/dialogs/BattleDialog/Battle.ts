import { EventManager } from '$lib/Util';
import type { EntityInstanceType, EntityTeamType } from '$lib/game/Entity';
import type { SkillModuleTypes, SkillType } from '$lib/game/Skills';

export class Battle {
  public events = new EventManager<{
    death: EntityInstanceType;
    finish: EntityTeamType;
  }>();

  public constructor(
    public aTeam: EntityTeamType,
    public bTeam: EntityTeamType
  ) {}

  public apply(target: EntityInstanceType, property: {}) {}

  public useSkill(
    user: EntityInstanceType,
    skill: SkillType<keyof SkillModuleTypes>,
    ...target: EntityInstanceType[]
  ): void {}
}
