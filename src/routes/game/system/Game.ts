import { getSource } from "$lib";
import {
  type Vector2,
  type Vector3,
  type MapFormat,
  type Entity,
  EntityConfig,
} from "$lib/types";

type Renderer = {
  render: (position: Vector2, world: World, fullRerendering?: boolean) => void;
  reloadTile: (x: number, y: number, entities: (Entity | undefined)[]) => void;
  width: number;
  height: number;
};

const DIR = {
  NONE: 0b0000,
  UP: 0b0001,
  DOWN: 0b0010,
  LEFT: 0b0100,
  RIGHT: 0b1000,
} as const;
type DIR = (typeof DIR)[keyof typeof DIR];

export type { Renderer };

export class CanvasRenderer implements Renderer {
  public spriteMap: { [key: string]: ImageBitmap } = {};

  // cache
  private cellSize = 0;
  private prevRenderPosition: Vector2 = { x: -1, y: -1 };

  // document
  private canvas?: HTMLCanvasElement;
  private ctx2d?: CanvasRenderingContext2D | null;

  public constructor(
    public width: Renderer["width"],
    public height: Renderer["height"]
  ) {}

  // 캔버스 변경시 호출
  public async setup(canvas: HTMLCanvasElement) {
    const { width, height } = this;
    const ctx = (this.ctx2d = (this.canvas = canvas).getContext("2d", {
      willReadFrequently: true,
    }));
    if (!ctx) return;

    // 캔버스 사이즈 설정
    const screenRatio = 2 / 3;
    let cellSize = (this.cellSize =
      window.innerWidth / width < window.innerHeight / height
        ? (window.innerWidth * screenRatio) / width
        : (window.innerHeight * screenRatio) / height);

    canvas.width = cellSize * (width + 0.1);
    canvas.height = cellSize * (height + 0.1);

    // 스케일링
    // TODO) 이거 어캐하는건지 모르겠음. - 현재 적용하면 오히려 스케일링이 이상하게됨
    // const scale = window.devicePixelRatio;

    // ctx.scale(scale, scale);
    // canvas.style.width = `${canvas.width}px`;
    // canvas.style.height = `${canvas.height}px`;
    // canvas.width *= scale;
    // canvas.height *= scale;

    // 캔버스 틀 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.setLineDash([1, cellSize / 5 - 1]);

    // 세로선
    for (let i = 1; i < width; i++) {
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
    }

    // 가로선
    for (let i = 1; i < height; i++) {
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
    }

    ctx.stroke();

    // 빈 셀 이미지 저장

    this.spriteMap["blank"] = await createImageBitmap(
      ctx.getImageData(1, 1, cellSize, cellSize),
      {
        resizeQuality: "pixelated",
        resizeHeight: cellSize,
        resizeWidth: cellSize,
      }
    );
    // putImageData | createImageData

    ctx.save();
  }

  public loadSprites(
    quality: ResizeQuality = "pixelated",
    ...sources: { src: string; name: string }[]
  ) {
    return new Promise<{ [key: string]: ImageBitmap }>((resolve, reject) => {
      const { spriteMap, cellSize } = this;
      const img = new Image();
      if (cellSize === 0 || sources.length < 1)
        reject("renderer is not loaded");

      let i = 0,
        m = sources.length - 1;

      img.onload = async () => {
        const source = sources[i];
        if (!source) {
          reject("target data does not exist.");
          return;
        }

        spriteMap[source.name] = await createImageBitmap(img, {
          resizeHeight: cellSize,
          resizeWidth: cellSize,
          resizeQuality: quality,
        });

        if (i < m) img.src = sources[(i += 1)]?.src as string;
        else {
          resolve(spriteMap);
          img.remove();
        }
      };

      img.onerror = (e) => {
        reject(e);
      };

      img.src = sources[i]?.src as string;
    });
  }

  public clearSpriteCache(...holds: string[]) {
    const blank = this.spriteMap["blank"] as ImageBitmap;
    const holder: { [key: string]: ImageBitmap | undefined } = {};

    if (holds) for (const str of holds) holder[str] = this.spriteMap[str];

    this.spriteMap = { blank, ...holder };
  }

  private drawEntity(entity: Entity, rx: number, ry: number) {
    const sprite = entity.sprite;
    const img =
      typeof sprite === "string"
        ? (this.spriteMap[sprite] as ImageBitmap)
        : sprite;

    this.drawImage(img, rx, ry);
  }

  private drawImage(img: ImageBitmap, rx: number, ry: number) {
    (this.ctx2d as CanvasRenderingContext2D).drawImage(
      img,
      rx * this.cellSize,
      ry * this.cellSize
    );
  }

  // 캔버스 전체 다시 렌더링
  public readonly render: Renderer["render"] = async (
    { x: tx, y: ty },
    world,
    full = false
  ) => {
    const { x: px, y: py } = this.prevRenderPosition;
    if (px === -1 && py === -1) this.prevRenderPosition = { x: tx, y: ty };
    if (!full && px === tx && py === ty) return;

    const { width: rw, height: rh, cellSize, ctx2d: ctx, spriteMap } = this,
      { layer, width: ww, height: wh } = world,
      preRenderDir =
        (tx > 1 ? DIR.LEFT : 0) |
        (tx < ww - rw ? DIR.RIGHT : 0) |
        (ty < wh - rh ? DIR.UP : 0) |
        (ty > 1 ? DIR.DOWN : 0);

    if (!ctx) throw new ReferenceError("캔버스가 초기화되지 않았습니다.");

    if (
      !full &&
      px < tx + rw &&
      px > tx - rw &&
      py < ty + rh &&
      py > ty - rh &&
      px !== -1 &&
      py !== -1
    ) {
      const mx = tx - px,
        my = ty - py,
        { width, height } = ctx.canvas,
        prevScene = await createImageBitmap(
          ctx.getImageData(0, 0, width, height),
          {
            resizeQuality: "pixelated",
          }
        );

      ctx.clearRect(0, 0, width, height);

      if (mx !== 0) {
        const cWidth = mx > 0 ? mx : -mx,
          cHeight = rh - (my > 0 ? my : -my),
          chunk = world.getChunkData(
            { x: mx > 0 ? px + rw : px - 1, y: ty },
            { x: cWidth, y: cHeight }
          );

        for (let i = layer - 1; i > -1; i--) {
          const eLayer = chunk[i] as Entity[];

          for (let y = cHeight - 1; y > -1; y--) {
            for (let x = 0; x < cWidth; x++) {
              this.drawEntity(
                eLayer[y * cWidth + x] as Entity,
                mx > 0 ? rw - cWidth + x : x,
                cHeight - y - 1
              );
            }
          }
        }
      }

      if (my > 0) {
      } else if (my < 0) {
      }

      ctx.drawImage(prevScene, cellSize * -mx, cellSize * my);
      console.log(cellSize * -mx);
      this.prevRenderPosition = { x: tx, y: ty };
      return;
    }

    // full rendering sequence
    const renderWidth = preRenderDir & DIR.RIGHT ? rw : rw + 1,
      chunk = world.getChunkData({ x: tx, y: ty }, { x: renderWidth, y: rh }),
      blankImg = spriteMap["blank"] as ImageBitmap,
      prevLine =
        ty !== 0
          ? world.getChunkData({ x: tx, y: ty - 1 }, { x: renderWidth, y: 1 })
          : [];

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = layer - 1; i > -1; i--) {
      const eLayer = chunk[i] as Entity[];
      const eLayerT = ty !== 0 ? (prevLine[i] as Entity[]) : [];

      for (let cx = 0; cx < renderWidth; cx++) {
        if (ty !== 0) {
          this.drawEntity(eLayerT[cx] as Entity, cx, rh);
        } else this.drawImage(blankImg, cx, rh);
      }

      for (let cy = 0; cy < rh; cy++) {
        for (let cx = 0; cx < renderWidth; cx++) {
          this.drawEntity(
            eLayer[cy * renderWidth + cx] as Entity,
            cx,
            rh - cy - 1
          );
        }
        if (renderWidth === rw) {
          this.drawImage(blankImg, rw, rh - cy - 1);
        }
      }
    }

    console.log(rw * this.cellSize);

    this.prevRenderPosition = { x: tx, y: ty };
  };

  public readonly reloadTile: Renderer["reloadTile"] = (x, y, entities) => {
    const {
      prevRenderPosition: { x: sx, y: sy },
      width,
      height,
      cellSize,
      spriteMap,
      ctx2d: ctx,
    } = this;
    const tx = x - sx - 1,
      ty = height - y + sy;

    if (tx < 0 || ty > height || !ctx) return;

    ctx.clearRect(tx * cellSize, ty * cellSize, cellSize, cellSize);

    for (const entity of entities) {
      if (!entity) continue;

      const { sprite } = entity;
      const img = typeof sprite === "string" ? spriteMap[sprite] : sprite;
      if (img) {
        this.drawImage(img, tx, ty);
      }
    }
  };
}

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
      eventSystem,
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
      this.staticEntities["blank"] = {
        name: "blank",
        sprite: "blank",
        module: false,
        config: EntityConfig.STATIC | EntityConfig.MOVEABLE,
      };

      this.scriptLoadStatus.max = entityDef.length;

      for (const { name, sprite, module, config } of entityDef) {
        const moveable = config?.moveable ?? true;

        const entity = (this.staticEntities[name] = {
          name: name,
          sprite: sprite,
          module: false,
          config:
            EntityConfig.STATIC | (moveable ? EntityConfig.MOVEABLE : 0b0),
        });

        if (module) {
          getSource(domain ? `${domain}${module}` : module).then((source) => {
            try {
              new Function("entity", `'use strict'; ${source}`)(entity);
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
          case "fill": {
            switch (script.shape) {
              case "rect": {
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
      getSource(`${domain ? domain : ""}${eventSystem}`).then((source) => {
        try {
          new Function("setEntity", `'use strict'; ${source}`)(
            (entityname: string, x: number, y: number, z?: number) => {
              this.setEntity({x, y, z: z ?? 0}, entityname)
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

    if (typeof entity == "string") {
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
