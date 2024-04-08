<script lang="ts">
  import './style.scss';

  let items: {
    [key: string]: {
      value: number;
      max: number | false;
    };
  } = {};

  let actions: {
    id: string;
    cooltime: number | false;
    method: () => void;
    currentCooltime: number;
  }[] = [];
</script>

<section id="basement"></section>

<style lang="scss">
  section#basement {
    height: 100%;
    display: flex;
  }
</style>
