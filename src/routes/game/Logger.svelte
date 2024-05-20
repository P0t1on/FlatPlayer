<script lang="ts">
  import SvgIcon from '$lib/SVGIcon.svelte';
  import type { LoggerType } from '$lib/game/Dialogs';
  import { onMount } from 'svelte';

  let loggerOpen = false,
    update = false;

  export let maximum: number = 100;
  export const logger: LoggerType = {
    log(sender, msg) {
      if (msgList.length < maximum) {
        msgList.push({ sender, msg });
        update = !update;
      }
    },
    clear() {
      msgList = [];
      update = !update;
    },
    delete(index) {
      msgList.splice(index, 1);
      update = !update;
    },
  };

  let msgList: {
    sender: string;
    msg: string;
  }[] = [
    {
      sender: 'System',
      msg: 'padding\n 속성은 한 개, 두 개, 세 개,\n 혹은 네 개의 값으로 지정할 수 있습니다.\n 각 값은\n <length>, <percentage> 중 하나로, 음수 값은 유효하지 \n않습니다.',
    },
    {
      sender: 'System',
      msg: 'test2',
    },
    {
      sender: 'System',
      msg: 'test3',
    },
  ];

  let contextOpen = false,
    contextDialog: HTMLDialogElement;

  function openContext(
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLUListElement;
    }
  ) {
    e.preventDefault();
    contextDialog.style.top = e.y + 'px';
    contextDialog.style.left = e.x + 'px';
    contextOpen = true;
  }

  let temp: Element[];

  onMount(() => {
    temp = [contextDialog, ...contextDialog.children];
  });
</script>

<svelte:window
  on:mousedown={(e) => {
    if (contextOpen && !temp.includes(e.target)) {
      contextOpen = false;
    }
  }}
/>

<div class:open={loggerOpen} id="logger">
  <dialog id="context" bind:this={contextDialog} open={contextOpen}>
    <button
      on:click={() => {
        logger.clear();
        contextOpen = false;
      }}
    >
      로그 모두 지우기
    </button>
  </dialog>

  <button class="handle" on:click={() => (loggerOpen = !loggerOpen)}>
    <SvgIcon type="arrow_drop_up" size={36} />
  </button>

  <ul class="logList" on:contextmenu={openContext} role="presentation">
    {#key update}
      {#each msgList as { sender, msg }, i}
        <li>
          <div class="sender">
            {sender}
            <br />
            <span>{i}</span>
          </div>
          <div class="msg">
            <span class="msg">{msg}</span>
            <div class="delete">
              <button on:click={() => logger.delete(i)}>
                <SvgIcon type="delete" />
              </button>
            </div>
          </div>
        </li>
      {/each}
    {/key}
  </ul>
</div>

<style lang="scss" module>
  div#logger {
    transition: all ease 0.5s;

    position: absolute;
    bottom: 0;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    dialog#context {
      position: fixed;
      z-index: 100;
      user-select: none;
      padding: 4px 0 4px 0;
      margin: 0;

      background-color: rgb(55, 55, 55);
      border: 0 solid transparent;
      border-radius: 4px;

      button {
        font-family: Noto Sans KR;
        font-size: smaller;
        color: white;
        padding: 2px 16px 2px 16px;
        background-color: transparent;
        border: none;

        &:hover {
          background-color: rgb(125, 125, 125);
        }
      }
    }

    button.handle {
      transition: all ease 0.5s;

      user-select: none;
      cursor: pointer;

      height: 44px;
      width: 44px;
      margin: 4px;
      padding: 0;
      border-radius: 16px;
      border: 1px solid transparent;
      background-color: transparent;
      color: white;
      font-size: xx-large;

      &:hover {
        border: 1px solid gray;
      }
    }

    ul.logList {
      transition:
        opacity ease 1s,
        height ease 0.5s,
        border ease 0.5s;
      padding: 0;
      margin: 0;
      height: 0;
      width: 90%;
      color: white;
      border: 0px solid white;
      opacity: 0;
      list-style: none;

      overflow-y: scroll;
      scrollbar-color: white transparent;
      li {
        border-bottom: 1px solid white;

        display: flex;
        justify-content: space-between;
        flex-direction: row;

        div.sender {
          padding: 4px 14px 4px 6px;
          font-weight: bolder;
          border-right: 2px solid white;
          width: 50px;

          span {
            font-size: smaller;
            font-weight: lighter;
          }
        }

        div.msg {
          width: 100%;
          padding: 2px;
          white-space: pre;
          display: flex;
          justify-content: space-between;

          div.delete {
            display: flex;
            align-items: flex-end;

            button {
              transition: all ease 0.4s;
              cursor: pointer;
              padding: 2px;
              margin: 0 8px 8px 0;
              background-color: transparent;
              border: 1px solid transparent;
              border-radius: 4px;

              &:hover {
                border: 1px solid gray;

                svg path {
                  transition: all ease 0.4s;
                  fill: white;
                }

                &:active {
                  background-color: gray;

                  svg path {
                    fill: black;
                  }
                }
              }
            }
          }
        }
      }
    }

    &.open {
      bottom: 1rem;

      button.handle {
        transform: rotate(180deg);
      }

      ul.logList {
        border: 4px solid white;
        height: 200px;
        opacity: 1;
      }
    }
  }
</style>
