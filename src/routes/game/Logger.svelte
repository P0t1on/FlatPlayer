<script lang="ts">
  import { onMount } from 'svelte';

  import type { LoggerType } from '$lib/game/basement';

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

  onMount(() => {
    const array = new Uint32Array(10);
    self.crypto.getRandomValues(array);

    console.log('오늘자 행운의 수:');
    for (const num of array) {
      console.log(num);
    }
  });
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
    {#key update}
      {#each msgList as { sender, msg }, i}
        <li>
          <div class="sender">
            {sender}
            <br />
            <span style="font-size:smaller; font-weight:lighter;">{i}</span>
          </div>
          <div class="msg">{msg}</div>
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
          padding: 4px 14px 4px 6px;
          font-weight: bolder;
          border-right: 2px solid white;
          width: 50px;
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
