<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let width = 100,
    height = 100;

  const dispatch = createEventDispatcher();
</script>

<article id="battle" style={`width:${width}px; height:${height}px`}>
  <div id="health"></div>
  <div id="field"></div>
  <div id="actions"></div>
  <div id="etc">
    <div id="specials"></div>
    <div id="consumes"></div>
  </div>
</article>

<style lang="scss">
  article#battle {
    display: flex;
    position: absolute;

    z-index: 2;
    padding: 8px;
    line-height: 10px;

    color: white;
    background-color: black;
    border: 2px solid gray;
  }
</style>
