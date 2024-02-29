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
                this.hooks.onMove.push(handler);
                break;
              }
            }
          },
        };

        const registerTool = (type: 'skill', target: any) => {
          switch (type) {
            case 'skill': {
              const { name, runner } = target as {
                name: string;
                runner: () => void;
              };

              SkillSlot.skills[name] = runner;
              break;
            }
          }
        };

        if (source.includes('document'))
          throw new EvalError(
            '소스에 존재하면 안되는 키워드 document가 있습니다.'
          );

        new Function(
          'events',
          'getEntity',
          'register',
          `'use strict'; ${source}`
        )(
          events,
          (position: Vector3) => world.getEntity(position),
          registerTool
        );
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
      targetPosition = { x: position.x + x, y: position.y + y, z: position.z },
      targetEntity = world.getEntity({
        x: position.x + x,
        y: position.y + y,
        z: position.z,
      }),
      moveable =
        (targetEntity && (targetEntity.option & EntityOption.MOVEABLE) === 0) ||
        position.x + x === 0 ||
        position.x + x > width ||
        position.y + y === 0 ||
        position.y + y > height;

    const moveCanceled = this.hooks.playerMove(targetPosition, moveable);

    if (moveable || moveCanceled) return;

    if (mode == 'relative') {
      world.setEntity(position, 'blank');
      position.x += x;
      position.y += y;
      world.setEntity(position, playerData);
    } else {
    }
  }

  public join(world: World) {
    const { playerData } = this;

    world.setEntity(playerData.position, playerData);
  }
}

class PlayerHooks {
  public onMove: ((
    position: Vector3,
    moveable: boolean,
    cancelMove: () => void
  ) => void)[] = [];
  public playerMove(position: Vector3, moveable: boolean): boolean {
    let moveCanceled = false;
    const cancelMove = () => (moveCanceled = true);

    for (const handler of this.onMove) {
      handler(position, moveable, cancelMove);
    }

    return moveCanceled;
  }
}

class SkillSlot {
  public static readonly skills: { [key: string]: () => void } = {};

  public constructor(public readonly index: number) {}

  public active() {}

  public set() {}

  public dispose() {}
}

export { PlayerManager, SkillSlot };
