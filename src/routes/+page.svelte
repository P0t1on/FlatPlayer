<script lang="ts">
  import { onMount } from "svelte";

  import { Explorer, Hub, MyPage } from "./documents";
  // import type { PageData } from "./$types";

  // export let data: PageData;

  // ref
  let li_menu: HTMLUListElement, div_doc: HTMLDivElement;

  // menu 구현
  const menuList: [HTMLLIElement, Element][] = [],
    onMenuClick = (id: string) => (e: MouseEvent) => {
      for (const [li, div] of menuList) {
        if (div.id === id) {
          li.classList.add("selected");
          div.classList.remove("hide");
        } else {
          li.classList.remove("selected");
          div.classList.add("hide");
        }
      }
    };

  onMount(() => {
    open("./game", "_self")
    for (const doc of div_doc.children) {
      const menu = document.createElement("li");
      li_menu.appendChild(menu);

      menu.innerHTML = doc.id;
      menu.onclick = onMenuClick(doc.id);

      menuList.push([menu, doc]);
    }

    menuList[0]?.[0].click();
  });
</script>

<svelte:head />

<div>
  <header>
    <ul id="menu" bind:this={li_menu}></ul>
  </header>
  <div id="document" bind:this={div_doc}>
    <Explorer/>
    <Hub/>
    <MyPage/>
  </div>
</div>

<style lang="scss">
  div {
    height: 100%;
    background-color: #9c95dc;

    header {
      background-color: #191331;

      ul#menu {
        margin: 0;
        display: flex;
        justify-content: space-evenly;

        list-style: none;
      }
    }
  }
</style>
