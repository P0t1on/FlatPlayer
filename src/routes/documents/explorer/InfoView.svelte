<script lang="ts">
  import { icon } from '$lib/Assets';
  import type { GithubRepo } from '$lib/Curl';
  import { createEventDispatcher } from 'svelte';

  export let info: GithubRepo;
  const dispatch = createEventDispatcher<{ openGameInfo: GithubRepo }>();
</script>

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
      on:click={() => dispatch('openGameInfo', info, { cancelable: true })}
    >
      <img class="nodrag" alt="play" src={icon('sports_esports')} />
    </button>
  </div>
</div>

<style lang="scss">
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

      &:hover {
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

        &:hover {
          animation-name: playButtonHover;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }

        &:active {
          animation-name: none;
          background-color: rgb(58, 58, 58);
        }
      }
    }
  }
</style>
