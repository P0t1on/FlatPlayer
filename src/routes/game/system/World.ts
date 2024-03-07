import { getSource } from '$lib/Curl';
import {
  type Vector2,
  type Vector3,
  type MapFormat,
  type Entity,
  EntityOption,
} from '$lib/types';

import type { Renderer } from './Game';

export class World {
  public readonly name: string;
  public readonly domain: string;
  public readonly width: number;
  public readonly height: number;
  public readonly layer: number;

  public readonly sprites: { name: string; src: string }[];
  public readonly staticEntities: { [key: string]: Entity } = {};

  public scriptLoadStatus = {
    max: 1,
    current: 0,
  };

  private render: Renderer;
  private data: (Entity | undefined)[][];

  public constructor(data: MapFormat, render: Renderer) {
    const {
      name,
      domain,
      width,
      height,
      layer,
      baseTile,
      sprites,
      entityDef,
      buildScripts,
      generator,
    } = data;

    // 기초 데이터 할당
    {
      this.name = name;
      this.domain = domain;
      this.width = width;
      this.height = height;
      this.layer = layer;
      this.render = render;
    }

    // sprites 데이터 로딩
    this.sprites = sprites.map(({ name, src }) => {
      return {
        name: name,
        src: domain ? `${domain}${src}` : src,
      };
    });

    // 정적 엔티티 로딩
    {
      this.staticEntities['blank'] = {
        name: 'blank',
        sprite: 'blank',
        module: false,
        option: EntityOption.STATIC | EntityOption.MOVEABLE,
      };

      this.scriptLoadStatus.max = entityDef.length;

      for (const {
        name,
        sprite,
        static: isStatic = true,
        module,
        option,
      } of entityDef) {
        const moveable = option?.moveable ?? true;

        const entity = (this.staticEntities[name] = {
          name: name,
          sprite: sprite,
          module: false,
          option:
            EntityOption.STATIC | (moveable ? EntityOption.MOVEABLE : 0b0),
        });

        if (module) {
          getSource(domain ? `${domain}${module}` : module).then((source) => {
            try {
              new Function('entity', 'events', `'use strict'; ${source}`)(
                entity
              );
            } catch (e) {
              console.log(`entity(${name}) loading error.`);
              console.log(e);
            }
          });
        }
      }
    }

    // 월드 생성
    {
      const baseTileData = this.staticEntities[baseTile] as Entity;
      const data = (this.data = Array.from({ length: layer }, () =>
        Array.from<undefined, Entity>(
          { length: width * height },
          () => baseTileData
        )
      ));

      for (const script of buildScripts) {
        switch (script.method) {
          case 'fill': {
            switch (script.shape) {
              case 'rect': {
                const {
                  entity: entityId,
                  position: { x: sx, y: sy, z },
                  size: { x: w, y: h },
                } = script;
                const entity = this.staticEntities[entityId] as Entity;

                for (let y = sy, my = sy + h; y < my; y++) {
                  for (let x = sx, mx = sx + w; x < mx; x++) {
                    (data[z] as Entity[])[(y - 1) * width + (x - 1)] = entity;
                  }
                }
                break;
              }
            }
            break;
          }
        }
      }
    }

    (() => {
      getSource(`${domain ? domain : ''}${generator}`).then((source) => {
        try {
          new Function('setEntity', 'world', `'use strict'; ${source}`)(
            (entityname: string, x: number, y: number, z?: number) => {
              this.setEntity({ x, y, z: z ?? 0 }, entityname);
            },
            {
              width,
              height,
            }
          );
        } catch (e) {
          console.log(`world (${name}) loading error.`);
          console.log(e);
        }
      });
    })();
  }

  /**
   * @returns SpriteID( number ) [world.layer] [width * height] 반환
   */
  public getChunkData(position: Vector2, size: Vector2) {
    const { width: mw, height: mh, layer, data } = this;
    const { x, y } = position,
      { x: width, y: height } = size;
    const resultMem = Array.from(
      { length: layer },
      () => new Array<Entity | undefined>(width * height)
    );

    if (mw < x + width || mh < y + height) {
      throw new RangeError(`데이터 범위를 벗어났습니다.`);
    }

    for (let cy = 0; cy < height; cy++) {
      for (let cx = 0; cx < width; cx++) {
        const entityIndex = (cy + y) * mw + (cx + x);

        for (let li = 0; li < layer; li++) {
          (resultMem[li] as Entity[])[cy * width + cx] = (data[li] as Entity[])[
            entityIndex
          ] as Entity; //(cx+x) + "_" + (cy + y);
        }
      }
    }

    return resultMem;
  }

  /**
   * @param entity 문자열의 경우 스프라이트 id 아니고 정적 엔티티 id임!! 헷갈림 주의!!
   */
  public setEntity({ x, y, z }: Vector3, entity: Entity | string) {
    const { layer, data, width } = this,
      targetPosition = (y - 1) * this.width + (x - 1);

    if (typeof entity == 'string') {
      const target = this.staticEntities[entity];
      if (target) {
        (data[z] as Entity[])[targetPosition] = target;
      } else return;
    } else {
      (data[z] as Entity[])[targetPosition] = entity;
    }

    const drawList = new Array<Entity | undefined>(layer);

    for (let i = 0; i < layer; i++) {
      drawList[layer - 1 - i] = data[i]?.[targetPosition];
    }
    this.render.reloadTile(x, y, drawList);
  }

  public getEntity({ x, y, z }: Vector3) {
    const { width } = this;
    return this.data[z]?.[(y - 1) * width + (x - 1)];
  }
}
