import { createKeyPressEvent } from "$lib";
import { CanvasRenderer, World } from "./Game";
import { PlayerManager } from "./Player";
import type { MapFormat } from "$lib/types";
import type { KeyboardEventHandler } from "svelte/elements";

class GameManager {
  public renderer: CanvasRenderer;
  public world?: World;
  public player?: PlayerManager;

  private canvas?: HTMLCanvasElement;
  private hooks = new GameHooks();

  public constructor(rendererWidth: number, rendererHeight: number) {
    const renderer = (this.renderer = new CanvasRenderer(
      rendererWidth,
      rendererHeight
    ));
    const hooks = this.hooks;

    hooks.keyPressEvent = ({ keyCode }) => {
      if (!this.player) return;

      switch (keyCode) {
        case 38:
          this.player.move({ x: 0, y: 1 });
          break; // UP
        case 40:
          this.player.move({ x: 0, y: -1 });
          break; // DOWN
        case 37:
          this.player.move({ x: -1, y: 0 });
          break; // LEFT
        case 39:
          this.player.move({ x: 1, y: 0 });
          break; // RIGHT
      }
    };
  }

  public async setupRenderer(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    if (!this.world || !canvas || !this.player) return;
    await this.renderer.setup(canvas);
  }

  public getHooks() {
    return {
      ...this.hooks.keyHook,
    };
  }

  public async loadWorld(mapData: MapFormat) {
    if (this.canvas) await this.setupRenderer(this.canvas);

    const { startPoint } = mapData;

    const world = (this.world = new World(mapData, this.renderer));
    const player = (this.player = new PlayerManager(
      world,
      startPoint,
      this.renderer
    ));

    world.setEntity(startPoint, player.playerData);

    if (this.canvas) this.reload();
  }

  public reload() {
    const pos = this.player?.playerData.position;
    if (pos && this.world) {
      this.renderer.render(pos, this.world);
    }
  }
}

class GameHooks {
  public keyPressEvent: KeyboardEventHandler<Document> = () => {};

  public keyHook = createKeyPressEvent<Document>((e) => this.keyPressEvent(e));
}

export { GameManager };
