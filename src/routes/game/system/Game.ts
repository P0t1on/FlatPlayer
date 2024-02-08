import type { Vector2, Entity } from "$lib/types";
import type { World } from "./World";

type Renderer = {
  render: (position: Vector2, world: World, fullRerendering?: boolean) => void;
  reloadTile: (x: number, y: number, entities: (Entity | undefined)[]) => void;
  width: number;
  height: number;
};

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
      ctx.getImageData(0, 0, cellSize, cellSize),
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

    const { width: rw, height: rh, ctx2d: ctx, spriteMap } = this,
      { layer } = world;

    if (!ctx) throw new ReferenceError("캔버스가 초기화되지 않았습니다.");

    // 현재 오류는 렌더링된 구역을 밀어서 재렌더링시 필요이상으로 밀어지는데 이게 어디서 오는 차이인건지 모르겠음.
    /* TODO 이거 구현만 하면 성능개선 ㅆㄱㄴ인데 방법을 몰?루
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
    */

    // full rendering sequence
    const chunk = world.getChunkData({ x: tx, y: ty }, { x: rw, y: rh }),
      blankImg = spriteMap["blank"] as ImageBitmap,
      prevLine =
        ty !== 0
          ? world.getChunkData({ x: tx, y: ty - 1 }, { x: rw, y: 1 })
          : [];

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = layer - 1; i > -1; i--) {
      const eLayer = chunk[i] as Entity[];
      const eLayerT = ty !== 0 ? (prevLine[i] as Entity[]) : [];

      for (let cx = 0; cx < rw; cx++) {
        if (ty !== 0) {
          this.drawEntity(eLayerT[cx] as Entity, cx, rh);
        } else this.drawImage(blankImg, cx, rh);
      }

      for (let cy = 0; cy < rh; cy++) {
        for (let cx = 0; cx < rw; cx++) {
          this.drawEntity(eLayer[cy * rw + cx] as Entity, cx, rh - cy - 1);
        }
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
