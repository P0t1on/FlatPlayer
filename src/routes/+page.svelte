<script lang="ts">
  import { onMount } from "svelte";
  // import type { PageData } from "./$types";

  // export let data: PageData;

  // ref
  let li_menu: HTMLUListElement, div_doc: HTMLDivElement;

  // menu 구현
  const menuList: [HTMLLIElement, HTMLDivElement][] = [],
    onMenuClick = (id: string) => (e: MouseEvent) => {
      for(const [li, div] of menuList) {
        if(div.id === id) {
          li.classList.add('selected');
          div.classList.remove('hide');
        } else {
          li.classList.remove('selected');
          div.classList.add('hide');
        }
      }

      console.log(id)
    };

  onMount(() => {
    // open("./game", "_self")
    for (const doc of div_doc.children) {
      const menu = document.createElement("li")
      li_menu.appendChild(menu);

      menu.innerHTML = doc.id;
      menu.onclick = onMenuClick(doc.id);

      menuList.push([menu, doc as HTMLDivElement]);
    }

    menuList[0]?.[0].click();
  });
</script>

<svelte:head />

<section>
  <header>
    <ul id="menu" bind:this={li_menu}>
    </ul>
  </header>
  <div id="document" bind:this={div_doc}>
    <div id="test1">test1</div>
    <div id="test2">test2</div>
    <div id="test3">test3</div>
  </div>
</section>

<style lang="scss">
  section {
    height: 100%;
    background-color: #9c95dc;

    header {
      background-color: #191331;

      ul#menu {
        display: flex;
        justify-content: space-evenly;

        list-style: none;

        :global(li) {
          margin: 8px;
          padding: 4px;

          background-color: #2d2d2d;
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
