<script lang="ts">
  let loggerOpen = true;

  export const maxMsgLength = 100;

  const msgList: {
    sender: string;
    msg: string;
  }[] = [
    {
      sender: 'System',
      msg: 'padding\n 속성은 한 개, 두\n 개, 세 개,\n 혹은 네 개의\n 값으로 지정할 수\n 있습니다.\n 각 값은\n <length>, <percentage> 중 하나로, 음수 값은 유효하지 \n않습니다.',
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
</script>

<div class:open={loggerOpen} id="logger">
  <span
    class="handle"
    role="button"
    tabindex={0}
    on:keydown={(e) =>
      (loggerOpen = e.code === 'Enter' ? !loggerOpen : loggerOpen)}
    on:click={() => (loggerOpen = !loggerOpen)}
  >
    ▲
  </span>
  <ul class="logList">
    {#each msgList as { sender, msg }}
      <li>
        <div class="sender">{sender}</div>
        <div class="msg">{msg}</div>
      </li>
    {/each}
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

    span.handle {
      transition: all ease 0.5s;

      user-select: none;
      cursor: pointer;

      color: white;
      font-size: xx-large;
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

      li {
        border-bottom: 1px solid white;

        display: flex;
        flex-direction: row;

        div.sender {
          padding: 4px 10px 4px 6px;
          font-weight: bolder;
          border-right: 2px solid white;
        }

        div.msg {
          padding: 2px;
          white-space: pre;
        }
      }
    }

    &.open {
      bottom: 1rem;

      span.handle {
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
