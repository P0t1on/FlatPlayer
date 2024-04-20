<script lang="ts">
  const msgList: {
    sender: string;
    msg: string;
  }[] = [
    {
      sender: 'System',
      msg: 'test1',
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

<div id="logger">
  <span class="handle">▲</span>
  <ul class="logList">
    {#each msgList as { sender, msg }}
      <li>
        <span class="sender">{sender}</span>
        <span class="msg">{msg}</span>
      </li>
    {/each}
  </ul>
</div>

<style lang="scss" module>
  div#logger {
    transition: all ease 0.5s;

    position: absolute;
    bottom: 4px;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    span.handle {
      margin-bottom: 4px;

      transition: all ease 0.5s;
      user-select: none;

      color: white;
      font-size: xx-large;
    }

    ul.logList {
      transition: all ease 0.5s;

      padding: 4px;
      margin: 0;
      height: 10px;
      width: 90%;
      border: 4px solid white;
      color: white;
      opacity: 0;
      list-style: none;

      li {
        span.sender {
          font-weight: bolder;
          border-right: 2px solid white;
        }
      }
    }

    &:hover {
      span.handle {
        transform: rotate(180deg);
      }

      ul.logList {
        height: 200px;
        opacity: 1;
      }
    }
  }
</style>
