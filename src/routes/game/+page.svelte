<script lang="ts">
  import { onMount } from "svelte";
  import { assets } from "$app/paths";
  import "./style.scss";

  import { GameManager } from "./system/Manager";
  import { getJson } from "$lib";
  import type { MapFormat } from "$lib/types";

  // 요소 바인딩
  let playerPosition: string;

  let canvas: HTMLCanvasElement;
  $: {
    if (canvas && game.world) {
      game.setupRenderer(canvas).then(async () => {
        playerPosition = JSON.stringify(game.player?.playerData.position);
      });
    }
  }

  const game = new GameManager(20, 20);
  let dataSet: IDBObjectStore;

  // 이벤트
  const { keydownHook, keyupHook } = game.getHooks();

  onMount(async () => {
    // 게임 데이터 초기화
    {
      await game.loadWorld(
        await getJson<MapFormat>(`${assets}/FlatMaps/flat.json`)
      );
      if (canvas) canvas = canvas;
      if (game.player) {
        game.player.hooks.onMove = (pos) => {
          playerPosition = JSON.stringify(pos);
          game.reload(pos);
        };
      }
    }
    // test
    {
    }
    // indexedDB
    {
      if (!window.indexedDB) {
        alert("This browser doesn't support IndexedDB");
      } else {
        const idb = indexedDB.open("camper", 1);

        idb.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          dataSet = idb.result.createObjectStore("DataSet", {
            autoIncrement: true,
          });

          dataSet.createIndex("id", "id", { unique: true });
          dataSet.createIndex("data", "data");
        };

        idb.onsuccess = (e) => {
          dataSet = idb.result
            .transaction("DataSet", "readwrite")
            .objectStore("DataSet");

          for (let i = 0; i < 10; i++) {
            dataSet.add(
              {
                data1: i * 2,
                data2: i * 3,
              },
              i
            );
          }
        };
      }
    }
  });
</script>

<svelte:document on:keydown={keydownHook} on:keyup={keyupHook} />

<section id="camper">
  <div class="playerPos">{playerPosition}</div>
  <canvas id="renderer" bind:this={canvas}></canvas>
</section>

<style lang="scss">
  section#camper {
    height: 100vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  div.playerPos {
    left: 0;
    top: 0;
    position: absolute;
    color: white;
  }
</style>
