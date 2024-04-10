<script lang="ts">
  import ActionSlot from './ActionSlot.svelte';
  import './style.scss';

  let items: {
    [key: string]: {
      value: number;
      max: number | false;
    };
  } = {};

  let actions: {
    id: string;
    name: string;
    cooltime: number | false;
    method: () => void;
    currentCooltime: number;
  }[] = [];
</script>

<section id="basement">
  <ul id="actionList">
    {#each actions as { currentCooltime, id, ...args }, i (i)}
      <ActionSlot {...args} />
    {/each}
  </ul>
</section>

<style lang="scss">
  section#basement {
    height: 100%;
    display: flex;

    ul#actionList {
      border: 2px solid white;

      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
        background-color: transparent;
        outline: solid 2px white;
      }

      &::-webkit-scrollbar-thumb {
        background-color: white;
      }
    }
  }
</style>
