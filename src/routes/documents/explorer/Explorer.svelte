<script lang="ts" context="module">
  const responseList = writable<GithubRepoSearchResponse | undefined>();
</script>

<script lang="ts">
  import { icon } from '$lib/Util';
  import {
    searchMap,
    type GithubRepoSearchResponse,
    type GithubRepoSearchResponseHeader,
    type GithubRepo,
    getFlatData,
  } from '$lib/Curl';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import InfoView from './InfoView.svelte';
  import './Explorer.scss';
  import { goto } from '$app/navigation';

  // ref
  let gameInfoDialog: HTMLDialogElement;

  // 검색 구현
  let searchString = '';
  let searchProcess:
    | Promise<[GithubRepoSearchResponse, GithubRepoSearchResponseHeader]>
    | undefined;

  const searchTrigger = async () => {
    searchProcess = searchMap(searchString);
    const data = await searchProcess;

    // @ts-ignore
    console.log('남은 요청 횟수 : ' + data[1]['x-ratelimit-remaining']);
    console.log(data[0]);

    responseList.set(data[0]);

    return await searchProcess;
  };

  // 게임 정보 창 구현

  let gameInfo: GithubRepo | undefined;
  const openGameInfo = (info: GithubRepo) => {
    console.log(info);
    gameInfo = info;
    gameInfoDialog.showModal();
  };

  const joinGame = () => {
    goto('/game', { state: { info: gameInfo } });
  };

  onMount(async () => {
    const info = (await searchTrigger())[0];
    openGameInfo(info.items[0] as GithubRepo);
  });
</script>

<article id="explorer">
  <div id="search">
    <input
      class="text"
      type="text"
      placeholder="검색어를 입력하세요."
      bind:value={searchString}
      on:keydown={(e) => {
        if (e.key === 'Enter') searchTrigger();
      }}
    />
    <button class="searchIcon clickable" on:click={searchTrigger} tabindex={0}>
      <img class="nodrag" alt="search" src={icon('search')} />
    </button>
  </div>
  <div id="searchResult">
    {#if searchProcess !== undefined}
      {#await searchProcess}
        <progress>loading</progress>
      {:then result}
        {#each result[0].items as info}
          <InfoView
            bind:info
            on:openGameInfo={({ detail }) => openGameInfo(detail)}
          />
        {/each}
      {/await}
    {:else if $responseList !== undefined}
      {#each $responseList.items as info}
        <InfoView
          bind:info
          on:openGameInfo={({ detail }) => openGameInfo(detail)}
        />
      {/each}
    {/if}
  </div>
  <dialog
    id="gameInfo_container"
    bind:this={gameInfoDialog}
    on:click={(e) => {
      if (e.target === gameInfoDialog) gameInfoDialog.close();
    }}
    role="presentation"
  >
    <div id="gameInfo">
      {#if gameInfo !== undefined}
        {#await getFlatData(gameInfo.full_name, gameInfo.default_branch)}
          <progress>loading</progress> <br />
          맵 데이터 불러오는 중...
        {:then data}
          <span class="name">{data.name}</span> <br />
          <span>게임 버전: {data.version}</span>
          <span>
            제작자: <a
              target="_blank"
              href={gameInfo.owner.html_url}
              title="제작자 페이지로 이동"
            >
              {gameInfo.owner.login}
            </a>
          </span>
          <span>맵 크기: {data.width} x {data.height}</span> <br />
          <span>
            {gameInfo.description !== null
              ? gameInfo.description
              : '설명이 없습니다.'}
          </span>
          <div class="play">
            <button on:click={joinGame}>
              <img class="nodrag" alt="search" src={icon('play')} />
            </button>
          </div>
        {/await}
      {:else}
        게임 데이터가 없습니다.
      {/if}
    </div>
  </dialog>
</article>

<style module lang="scss">
  article#explorer {
    display: flex;
    flex-direction: column;

    a {
      color: black;
      text-decoration: none;

      &:hover {
        color: white;
      }
    }

    div#search {
      position: relative;
      left: 10%;
      min-width: 30%;
      width: fit-content;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 8px 2px 2px 8px;
      padding: 8px;
      border: 1px solid white;
      border-radius: 4px;

      input.text {
        background-color: transparent;
        font-size: larger;
        border: none;
        width: 100%;

        margin-right: 8px;

        &::placeholder {
          color: gray;
        }

        &:focus-visible {
          outline: none;
        }
      }

      button.searchIcon {
        background-color: transparent;
        padding: 4px;
        border-radius: 8px;

        &:hover {
          animation-name: playButtonHover;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }

        &:active {
          animation-name: none;
          outline: 1px solid black;
          background-color: gray;
        }
      }
    }

    div#searchResult {
      position: relative;
      left: 10%;
      width: 80%;
      height: 100%;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    dialog#gameInfo_container {
      width: 100%;
      height: 100%;

      &:not([open]) {
        display: none;
      }
      display: flex;
      justify-content: center;
      align-items: center;

      background-color: rgba(0, 0, 0, 0.699);

      div#gameInfo {
        user-select: none;
        background-color: gray;
        width: 60%;
        height: 60%;
        padding: 8px;

        display: flex;
        flex-direction: column;

        border: 4px black;
        border-style: ridge;
        border-radius: 8px;

        span.name {
          width: 100%;
          text-align: center;
          font-weight: bolder;
          font-size: larger;
        }

        .play {
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;

          button {
            background: none;
            border: none;
            cursor: pointer;

            &:hover {
              animation-name: playButtonHover;
              animation-duration: 0.5s;
              animation-fill-mode: forwards;
            }

            &:active {
              animation-name: none;
              background-color: rgb(70, 70, 70);
            }
          }
        }
      }
    }
  }
</style>
