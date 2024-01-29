import { EntityConfig } from "$lib/types";

import type { World, Renderer } from "./Game";
import type { Vector3, Vector2, Entity } from "$lib/types";

type PlayerData = {
  position: Vector3;
} & Entity;

export type { PlayerData };

class PlayerManager {
  public world: World;
  public playerData: PlayerData;
  public render: Renderer;

  public readonly hooks = new PlayerHooks();

  public constructor(world: World, startPos: Vector3, render: Renderer) {
    this.playerData = {
      name: "player",
      position: { ...startPos },
      sprite: "player",
      module: false,
      config: EntityConfig.NONE,
    };
    this.world = world;
    this.render = render;
  }

  public move(
    { x, y }: Vector2,
    mode: "absolute" | "relative" = "relative"
  ): void {
    const { playerData, world } = this,
      { width, height } = world;
    const position = playerData.position,
      targetEntity = world.getEntity({
        x: position.x + x,
        y: position.y + y,
        z: position.z,
      });
    if (
      (targetEntity && (targetEntity.config & EntityConfig.MOVEABLE) === 0) ||
      position.x + x === 0 ||
      position.x + x > width ||
      position.y + y === 0 ||
      position.y + y > height
    )
      return;

    if (mode == "relative") {
      world.setEntity(position, "blank");
      position.x += x;
      position.y += y;
      world.setEntity(position, playerData);
      this.hooks.playerMove(position);
    } else {
    }
  }

  public join(world: World) {
    const { playerData } = this;

    world.setEntity(playerData.position, playerData);
  }
}

class PlayerHooks {
  public onMove = (position: Vector3) => {};
  public readonly playerMove = (position: Vector3) => {
    this.onMove(position);
  };
}

export { PlayerManager };
