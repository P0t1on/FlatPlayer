<script lang='ts'>
  import './style.scss';
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
  <script
    src="https://raw.githubusercontent.com/LeaVerou/prefixfree/gh-pages/prefixfree.min.js"
  ></script>
</svelte:head>

<slot />

<style lang="scss">
  :global(body, html) {
    margin: 0;
    height: 100%;
  }
</style>
