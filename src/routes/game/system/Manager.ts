import type { KeyboardEventHandler } from "svelte/elements";
import type { Writable } from "svelte/store";

import { createKeyPressEvent } from "$lib";
import { StatusConfig, type MapFormat, type Vector3 } from "$lib/types";

import { CanvasRenderer } from "./Game";
import { World } from "./World";
import { PlayerManager } from "./Player";
import Status from "../components/Status.svelte";

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

  public async setupRenderer({
    canvas,
    statusBar,
  }: {
    canvas: HTMLCanvasElement;
    statusBar: HTMLUListElement;
  }) {
    this.canvas = canvas;
    const { world, player, renderer } = this;
    if (!world || !canvas || !player) return;

    await renderer.setup(canvas);
    renderer.clearSpriteCache();
    await renderer.loadSprites("high", ...world.sprites);

    this.reload(player.playerData.position, true);

    {
      const status = player.status;

      for (const id in status) {
        const stat = status[id];
        if (!stat) continue;

        const { displayName, color, max, value, unit, config } = stat;

        if (!(config & StatusConfig.VISIBLE)) return;
        else
          new Status({
            target: statusBar,
            props: { value, color, max, name: displayName, unit },
          });
      }
    }
  }

  public getHooks() {
    return {
      ...this.hooks.keyHook,
    };
  }

  public async loadWorld(mapData: MapFormat) {
    const { startPoint, status } = mapData;

    const world = (this.world = new World(mapData, this.renderer));
    const player = (this.player = new PlayerManager(
      world,
      startPoint,
      this.renderer,
      status
    ));

    world.setEntity(startPoint, player.playerData);

    if (this.canvas) {
      this.reload();
    }
  }

  public reload(targetPos?: Vector3, fullRerendering: boolean = false) {
    const { world } = this,
      pos = targetPos ? targetPos : this.player?.playerData.position;
    if (pos && world) {
      const { render, width: rw, height: rh } = this.renderer,
        { x: px, y: py } = pos,
        { width: mw, height: mh } = world;

      render(
        {
          x: px < rw / 2 ? 0 : px < mw - rw / 2 ? px - rw / 2 : mw - rw,
          y: py < rh / 2 ? 0 : py < mh - rh / 2 ? py - rh / 2 : mh - rh,
        },
        world,
        fullRerendering
      );
    }
  }
}

class GameHooks {
  public keyPressEvent: KeyboardEventHandler<Document> = () => {};

  public keyHook = createKeyPressEvent<Document>((e) => this.keyPressEvent(e));
}

export { GameManager };
