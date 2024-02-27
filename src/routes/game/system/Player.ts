import { writable } from 'svelte/store';

import { EntityOption, StatusOption } from '$lib/types';

import type { Writable } from 'svelte/store';
import type { Renderer } from './Game';
import type { World } from './World';
import type { Vector3, Vector2, Entity, StatusFormat } from '$lib/types';
import { getSource } from '$lib';

type PlayerData = {
  position: Vector3;
} & Entity;

export type { PlayerData };

class PlayerManager {
  public playerData: PlayerData;
  public readonly skills: [
    SkillSlot,
    SkillSlot,
    SkillSlot,
    SkillSlot,
    SkillSlot,
    SkillSlot,
    SkillSlot,
    SkillSlot,
    SkillSlot
  ] = [
    new SkillSlot(0),
    new SkillSlot(1),
    new SkillSlot(2),
    new SkillSlot(3),
    new SkillSlot(4),
    new SkillSlot(5),
    new SkillSlot(6),
    new SkillSlot(7),
    new SkillSlot(8),
  ];
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
    public world: World,
    startPos: Vector3,
    public render: Renderer,
    status: StatusFormat[],
    scriptSrc: string
  ) {
    this.playerData = {
      name: 'player',
      position: { ...startPos },
      sprite: 'player',
      module: false,
      option: EntityOption.NONE,
    };

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

    getSource(scriptSrc).then((source) => {
      try {
        const events = {
          on: (eventName: 'move', handler: any) => {
            switch (eventName) {
              case 'move': {
                const method = handler as (position: Vector3) => void;
                this.hooks.onMove.push(method);
                break;
              }
            }
          },
        };
        new Function('events', `'use strict'; ${source}`)(events);
      } catch (e) {
        console.log(`PlayerSystem (${scriptSrc}) loading error.`);
        console.log(e);
      }
    });
  }

  public move(
    { x, y }: Vector2,
    mode: 'absolute' | 'relative' = 'relative'
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

    if (mode == 'relative') {
      world.setEntity(position, 'blank');
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
  public onMove: ((position: Vector3) => void)[] = [];
  public readonly playerMove = (position: Vector3) => {
    for (const handler of this.onMove) {
      handler(position);
    }
  };
}

class SkillSlot {
  public constructor(public readonly index: number) {}

  public active() {}

  public set() {}

  public dispose() {}
}

export { PlayerManager, SkillSlot };
