<script lang="ts">
  import { onMount } from 'svelte';
  import { assets } from '$app/paths';

  import Interaction from './components/Interaction.svelte';

  import { getFlatData, type GithubRepo } from '$lib/Curl';
  import { GameManager } from './system/Manager';

  import './style.scss';

  // 요소 바인딩
  let playerPosition: string;

  let canvas: HTMLCanvasElement, statusBar: HTMLUListElement;
  let activeBattleScene: boolean = false;

  $: {
    if (canvas && game.world) {
      game.setupRenderer({ canvas, statusBar }).then(() => {
        playerPosition = JSON.stringify(game.player?.playerData.position);
      });
    }
  }

  const game = new GameManager(20, 20);
  let dataSet: IDBObjectStore;

  // 이벤트
  const { keydownHook, keyupHook } = game.getHooks();

  onMount(async () => {
    console.clear();
    // 게임 데이터 초기화
    {
      const info: GithubRepo = history.state['sveltekit:states'].info;
      const flatData = await getFlatData(info.full_name, info.default_branch);

      await game.loadWorld(flatData);
      if (canvas) canvas = canvas;
      if (game.player) {
        game.player.hooks.onMove.push((pos) => {
          playerPosition = JSON.stringify(pos);
          game.reload(pos);
        });
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
        const idb = indexedDB.open('camper', 1);

        idb.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          dataSet = idb.result.createObjectStore('DataSet', {
            autoIncrement: true,
          });

          dataSet.createIndex('id', 'id', { unique: true });
          dataSet.createIndex('data', 'data');
        };

        idb.onsuccess = (e) => {
          dataSet = idb.result
            .transaction('DataSet', 'readwrite')
            .objectStore('DataSet');

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

  let sbw1: number, sbw2: number, statusBarWidth: number;

  $: {
    sbw1 = ((window.innerWidth - canvas?.width) / 2 - 16) / 3;
    sbw2 = (window.innerWidth - canvas?.width) / 2 - 32;
    statusBarWidth = window.innerWidth / 5 < sbw2 ? sbw1 : sbw2;
  }

  // test
  const temp = (val: number) => {
    const stat = game.player?.status['hp'];
    if (stat) {
      stat.value.update((v) => v + val);
      activeBattleScene = !activeBattleScene;
    }
  };
</script>

<svelte:document on:keydown={keydownHook} on:keyup={keyupHook} />
<svelte:head>
  <title>Flat survival</title>
</svelte:head>
<section id="game">
  <button on:click={() => temp(10)}>+10</button>
  <button on:click={() => temp(-10)}>-10</button>
  <header>
    <ul
      id="statusBar"
      bind:this={statusBar}
      style={`width:${statusBarWidth}px;`}
    />
  </header>
  <div class="playerPos">{playerPosition}</div>
  <canvas id="renderer" bind:this={canvas} />
  <Interaction
    width={canvas?.width * (9 / 10) + 'px'}
    height={canvas?.height * (9 / 10) + 'px'}
    player={game.player}
    bind:active={activeBattleScene}
  />
</section>

<style lang="scss">
  section#game {
    height: 100vh;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    header {
      display: flex;
      justify-content: center;

      ul#statusBar {
        position: absolute;
        left: 16px;
        padding: 0;

        display: flex;
        flex-direction: column;
      }
    }

    canvas#renderer,
    ul#statusBar {
      z-index: 1;
    }
  }

  div.playerPos {
    left: 0;
    top: 0;
    position: absolute;
    color: white;
  }
</style>
