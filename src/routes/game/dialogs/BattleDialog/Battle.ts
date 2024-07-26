import type { EntityInstanceType, EntityTeamType } from '$lib/game/Entity';
import type { ModuleTypes, SkillType } from '$lib/game/Skills';

export class Battle {
  public constructor(
    public aTeam: EntityTeamType,
    public bTeam: EntityTeamType
  ) {}

  public useSkill(
    user: EntityInstanceType,
    skill: SkillType<ModuleTypes>,
    ...target: EntityInstanceType[]
  ): void {}
}
