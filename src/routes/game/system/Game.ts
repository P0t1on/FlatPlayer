import { getSource } from "$lib";
import type { Vector2, Vector3, MapFormat, Entity } from "$lib/types";

type Renderer = {
  render: (position: Vector2, world: World, fullRerendering?: boolean) => void;
  reloadTile: (x: number, y: number, entities: (Entity | undefined)[]) => void;
  width: number;
  height: number;
};

export type { Renderer };

export class CanvasRenderer implements Renderer {
  public readonly width: Renderer["width"];
  public readonly height: Renderer["height"];
  public spriteMap: { [key: string]: ImageBitmap } = {};

  // cache
  private cellSize = 0;
  private prevRenderPosition: Vector2 = { x: 0, y: 0 };

  // document
  private canvas?: HTMLCanvasElement;
  private ctx2d?: CanvasRenderingContext2D | null;

  public constructor(width: Renderer["width"], height: Renderer["height"]) {
    this.width = width;
    this.height = height;
  }

  // 캔버스 변경시 호출
  public async setup(canvas: HTMLCanvasElement) {
    const { width, height } = this;
    const ctx = (this.ctx2d = (this.canvas = canvas).getContext("2d"));
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
      ctx.getImageData(cellSize, cellSize, cellSize, cellSize)
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

  // 캔버스 전체 다시 렌더링
  public readonly render: Renderer["render"] = (
    { x: tx, y: ty },
    world,
    full = false
  ) => {
    const { x: px, y: py } = this.prevRenderPosition;
    if (!full && px === tx && py === ty) return;

    const { width: rw, height: rh, cellSize, ctx2d: ctx, spriteMap } = this,
      { layer, width: ww } = world,
      renderWidth = tx < ww - rw ? rw + 1 : rw;

    const chunk = world.getChunkData(
        { x: tx, y: ty },
        { x: renderWidth, y: rh }
      ),
      blankImg = spriteMap["blank"] as ImageBitmap,
      prevLine =
        ty !== 0
          ? world.getChunkData({ x: tx, y: ty - 1 }, { x: renderWidth, y: 1 })
          : [];

    if (!ctx) throw new ReferenceError("캔버스가 초기화되지 않았습니다.");

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let li = layer - 1; li > -1; li--) {
      const eLayer = chunk[li] as Entity[];
      const eLayerT = ty !== 0 ? (prevLine[li] as Entity[]) : [];

      for (let cx = 0; cx < renderWidth; cx++) {
        if (ty !== 0) {
          const { sprite } = eLayerT[cx] as Entity;
          const img =
            typeof sprite === "string"
              ? (spriteMap[sprite] as ImageBitmap)
              : sprite;

          if (img) ctx.drawImage(img, cx * cellSize, rh * cellSize);
        } else ctx.drawImage(blankImg, cx * cellSize, rh * cellSize);
      }

      for (let cy = 0; cy < rh; cy++) {
        for (let cx = 0; cx < renderWidth; cx++) {
          const { sprite } = eLayer[cy * renderWidth + cx] as Entity;
          const img =
            typeof sprite === "string"
              ? (spriteMap[sprite] as ImageBitmap)
              : sprite;

          if (img) ctx.drawImage(img, cx * cellSize, (rh - cy - 1) * cellSize);
        }
        if (renderWidth === rw){
          ctx.drawImage(
            blankImg,
            (rw) * cellSize,
            (rh - cy - 1) * cellSize
          );}
      }
    }

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
    ctx.drawImage(
      spriteMap["blank"] as ImageBitmap,
      tx * cellSize,
      ty * cellSize
    );

    for (const entity of entities) {
      if (!entity) continue;

      const { sprite } = entity;
      const img = typeof sprite === "string" ? spriteMap[sprite] : sprite;
      if (img) {
        ctx.drawImage(img, tx * cellSize, ty * cellSize);
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
        static: true,
        name: "blank",
        sprite: "blank",
        module: false,
        config: {
          moveable: true,
        },
      };

      this.scriptLoadStatus.max = entityDef.length;

      for (const { name, sprite, module, config } of entityDef) {
        const moveable = config?.moveable ?? true;

        const entity = (this.staticEntities[name] = {
          static: true,
          name: name,
          sprite: sprite,
          module: false,
          config: {
            moveable,
          },
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
