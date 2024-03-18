<script lang="ts" context="module">
  const responseList = writable<GithubRepoSearchResponse | undefined>();
</script>

<script lang="ts">
  import { icon } from '$lib/Assets';
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
  import type { MapFormat } from '$lib/types';

  // ref
  let gameInfoDialog: HTMLDialogElement;

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

  let gameInfo: GithubRepo | undefined;
  const openGameInfo = (info: GithubRepo) => {
    console.log(info);
    gameInfo = info;
    gameInfoDialog.showModal();
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
          <span class="name">{data.name}</span>
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

        border: 4px black;
        border-style: ridge;
        border-radius: 8px;
      }
    }
  }
</style>
