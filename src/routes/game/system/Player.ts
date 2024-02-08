import { writable } from "svelte/store";

import { EntityOption, StatusOption } from "$lib/types";

import type { Writable } from "svelte/store";
import type { Renderer } from "./Game";
import type { World } from "./World";
import type { Vector3, Vector2, Entity, StatusFormat } from "$lib/types";

type PlayerData = {
  position: Vector3;
} & Entity;

export type { PlayerData };

class PlayerManager {
  public world: World;
  public playerData: PlayerData;
  public render: Renderer;
  public status: {
    [key: string]: {
      displayName: Writable<string> | undefined;
      color: Writable<string>;
      max: Writable<number>;
      value: Writable<number>;
      unit: string | undefined;
      option: number;
    };
  } = {};

  public readonly hooks = new PlayerHooks();

  public constructor(
    world: World,
    startPos: Vector3,
    render: Renderer,
    status: StatusFormat[]
  ) {
    this.playerData = {
      name: "player",
      position: { ...startPos },
      sprite: "player",
      module: false,
      option: EntityOption.NONE,
    };
    this.world = world;
    this.render = render;

    for (const { id, displayName, color, max, start, option, unit } of status) {
      this.status[id] = {
        displayName: displayName ? writable(displayName) : undefined,
        color: writable(color),
        max: writable(max ?? 0),
        value: writable(start ?? 0),
        unit,
        option: option
          ? (option.deathOnZero ? StatusOption.DEATHONZERO : 0) ^
            (option.visible ? StatusOption.VISIBLE : 0)
          : StatusOption.NONE,
      };
    }
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
      (targetEntity && (targetEntity.option & EntityOption.MOVEABLE) === 0) ||
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
