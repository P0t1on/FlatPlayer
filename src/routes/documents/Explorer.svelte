<script lang="ts">
  import { searchMap, type GithubRepoSearchResponse } from '$lib/Curl';
  import { onMount } from 'svelte';

  let searchString = '';
  let searchProcess: Promise<GithubRepoSearchResponse>;

  const searchTrigger = async () => {
    searchProcess = searchMap(searchString);
    console.log(await searchProcess);
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
      tabindex="0"
    >
      search
    </span>
  </div>
  <div id="searchResult">
    {#if searchProcess !== undefined}
      {#await searchProcess}
        loading
      {:then result}
        {#each result.items as info}
          <div class="item">
            <span class="border"
              >&lt;{info.owner.login} - {info.name}&gt;
            </span>
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
      background-color: gray;

      div.item {
        outline-style: double;
        // outline-color: #9c95dc;
        user-select: none;

        &:hover {
          outline-style: auto;
          cursor: pointer;
        }
      }
    }
  }
</style>
