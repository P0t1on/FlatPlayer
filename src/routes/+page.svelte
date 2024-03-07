<script lang="ts">
  import { onMount } from 'svelte';

  import { Explorer, Hub, MyPage } from './documents';
  // import type { PageData } from "./$types";

  // export let data: PageData;

  // menu 구현
  let selectedMenu = 1;
  const menuList = [
    {
      name: '맵 검색',
      component: Explorer,
    },
    {
      name: '홈',
      component: Hub,
    },
    {
      name: '내 정보',
      component: MyPage,
    },
  ];

  onMount(() => {
    //open("./game", "_self")
  });
</script>

<svelte:head />

<div>
  <header>
    <ul id="menu">
      {#each menuList as { name }, i}
        <li
          class={i == selectedMenu ? 'selected' : ''}
          on:click={() => (selectedMenu = i)}
          on:keydown
          role="menuitem"
        >
          {name}
        </li>
      {/each}
    </ul>
  </header>
  <div id="document">
    <svelte:component this={menuList[selectedMenu]?.component} />
  </div>
</div>

<style lang="scss">
  div {
    min-height: 100%;
    background-color: #9c95dc;

    header {
      background-color: #191331;

      ul#menu {
        margin: 0;
        display: flex;
        justify-content: space-evenly;

        list-style: none;

        li {
          padding: 4px;

          background-color: #2d2d2d;
          border: 1px solid gray;
          color: burlywood;
          font-weight: bold;
          font-size: large;
          user-select: none;
          cursor: pointer;

          &.selected {
            background-color: #13062b;
            cursor: default;
          }
        }
      }
    }
  }
</style>
