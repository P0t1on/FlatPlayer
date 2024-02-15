<script lang="ts">
  export let width = 100,
    height = 100;
</script>

<article id="battle" style={`width:${width}px; height:${height}px`}>
  text
</article>

<style lang="scss">
  article#battle {
    z-index: 2;
    position: absolute;
    color: white;
    background-color: black;

    border: 2px solid gray;
  }
</style>
