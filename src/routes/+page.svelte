<script lang="ts" context="module">
  const selectedMenu = writable(4);
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { getConfig } from '$lib/Util';
  import Explorer from './documents/explorer/Explorer.svelte';
  import Server from './documents/server/Server.svelte';
  import Hub from './documents/Hub.svelte';
  import MyPage from './documents/MyPage.svelte';
  import Setting from './documents/setting/Setting.svelte';
  // import type { PageData } from "./$types";

  // export let data: PageData;

  // menu 구현
  let menuList = [
    {
      name: '맵 스토어',
      component: Explorer,
    },
    {
      name: '홈',
      component: Hub,
    },
    {
      name: '라이브러리',
      component: MyPage,
    },
    {
      name: '설정',
      component: Setting,
    },
  ];

  // setting comp
  let isSettingChanged: boolean;
  const changeMenu = (i: number) => {
    if (isSettingChanged) {
      if (!confirm('변경된 설정이 적용되지 않았습니다. 정말로 나가시겠습니까?'))
        return;
      else isSettingChanged = false;
    }
    selectedMenu.set(i);
  };

  onMount(() => {
    if (getConfig('enableMultiplayer', 'boolean', false)) {
      menuList.splice(1, 0, {
        name: '서버',
        component: Server,
      });
      menuList = [...menuList];
    }

    const selected = new Number(
      sessionStorage.getItem('selectedMenu')
    ) as number;
    selectedMenu.update((v) => selected ?? v);
    selectedMenu.subscribe((e) =>
      sessionStorage.setItem('selectedMenu', new String(e) as string)
    );
  });
</script>

<svelte:head />

<div>
  <header>
    <ul id="menu">
      {#each menuList as { name }, i}
        <li
          class={i === $selectedMenu ? 'selected' : ''}
          on:click={() => changeMenu(i)}
          on:keydown={(e) => {
            if (e.key === 'Enter') changeMenu(i);
          }}
          role="menuitem"
          tabindex={i == $selectedMenu ? -1 : 0}
        >
          {name}
        </li>
      {/each}
    </ul>
  </header>
  <div id="document">
    {#if menuList[$selectedMenu]?.component === Setting}
      <Setting bind:isChanged={isSettingChanged} />
    {:else}
      <svelte:component this={menuList[$selectedMenu]?.component} />
    {/if}
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
