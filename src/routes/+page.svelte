<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  onMount(() => {
    console.log(data)
    // open("./game", "_self")
  });
</script>

<svelte:head />

<section>test</section>

<style lang="scss">
</style>
