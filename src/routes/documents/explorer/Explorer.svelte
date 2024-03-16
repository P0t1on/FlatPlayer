<script lang="ts" context="module">
  const responseList = writable<GithubRepoSearchResponse | undefined>();
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { icon } from '$lib/Assets';
  import {
    searchMap,
    type GithubRepoSearchResponse,
    type GithubRepoSearchResponseHeader,
  } from '$lib/Curl';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import './Explorer.scss';

  let searchString = '';
  let searchProcess:
    | Promise<[GithubRepoSearchResponse, GithubRepoSearchResponseHeader]>
    | undefined;

  const searchTrigger = async () => {
    searchProcess = searchMap(searchString);
    const data = (await searchProcess)[0];

    console.log(data);
    responseList.set(data);
  };

  onMount(() => {
    // searchTrigger();
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
          <div class="item">
            <span class="bolder">
              [ <a target="_blank" href={info.owner.html_url}>
                {info.owner.login}
              </a>
              -
              <a target="_blank" href={info.html_url}>{info.name}</a> ]
            </span> <br />
            <div class="container">
              <button
                class="clickable play"
                on:click={() => goto('./game', { state: { val: 123 } })}
              >
                <img class="nodrag" alt="play" src={icon('sports_esports')} />
              </button>
            </div>
            <!-- {JSON.stringify(info)} -->
          </div>
        {/each}
      {/await}
    {:else if $responseList !== undefined}
      {#each $responseList.items as info}
        <div class="item">
          <span class="bolder">
            [ <a target="_blank" href={info.owner.html_url}
              >{info.owner.login}</a
            >
            -
            <a target="_blank" href={info.html_url}>{info.name}</a> ]
          </span> <br />
          <div class="container">
            <button
              class="clickable play"
              on:click={() => goto('./game', { state: { val: 123 } })}
            >
              <img class="nodrag" alt="play" src={icon('sports_esports')} />
            </button>
          </div>
          <!-- {JSON.stringify(info)} -->
        </div>
      {/each}
    {/if}
  </div>
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

        &:hover,
        &:focus {
          animation-name: playButtonHover;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }

        &:active {
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

      div.item {
        border-style: dashed;
        background-color: gray;
        margin: 5px 0 5px 0;
        padding: 8px;
        width: 90%;
        user-select: none;

        &:hover {
          border-style: solid;
        }

        a {
          color: black;
          text-decoration: none;

          &:hover,
          &:focus {
            color: white;
          }
        }

        div.container {
          display: flex;
          justify-content: flex-end;

          button.play {
            background-color: transparent;
            border: none;
            border-radius: 5px;

            &:hover,
            &:focus {
              animation-name: playButtonHover;
              animation-duration: 0.5s;
              animation-fill-mode: forwards;
            }
          }
        }
      }
    }
  }
</style>
