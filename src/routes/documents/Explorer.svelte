<script lang="ts">
  import {
    searchMap,
    type GithubRepoSearchResponse,
    type GithubRepoSearchResponseHeader,
  } from '$lib/Curl';
  import { onMount } from 'svelte';

  let searchString = '';
  let searchProcess:
    | Promise<[GithubRepoSearchResponse, GithubRepoSearchResponseHeader]>
    | undefined;

  const searchTrigger = async () => {
    searchProcess = searchMap(searchString);
    console.log((await searchProcess)[0]);
  };

  onMount(() => {
    // searchTrigger();
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
</svelte:head>

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
    <span
      class="material-symbols-outlined searchIcon"
      on:click={searchTrigger}
      on:keydown
      role="button"
      tabindex={0}
    >
      search
    </span>
  </div>
  <div id="searchResult">
    {#if searchProcess !== undefined}
      {#await searchProcess}
        <progress>loading</progress>
      {:then result}
        {#each result[0].items as info}
          <div class="item">
            <span class="bolder">
              [ <a target="_blank" href={info.owner.html_url}
                >{info.owner.login}</a
              >
              -
              <a target="_blank" href={info.html_url}>{info.name}</a> ]
            </span> <br />
            <span> test </span>
            <!-- {JSON.stringify(info)} -->
          </div>
        {/each}
      {/await}
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

      span.searchIcon {
        padding: 4px;
        border-radius: 8px;
        user-select: none;
        cursor: pointer;

        &:hover {
          box-shadow: inset 0 2px 16px black;
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
        width: -webkit-fill-available;
        width: -moz-fill-available;
        width: fill-available;
        user-select: none;

        &:hover {
          border-style: solid;
        }

        a {
          color: black;
          text-decoration: none;

          &:hover {
            color: white;
          }
        }
      }
    }
  }
</style>
