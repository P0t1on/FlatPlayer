<script lang="ts">
  export let title: string, x: number, y: number;
</script>

<div
  style="
		top: {y + 5}px;
		left: {x + 5}px;"
>
  {title}
</div>

<style>
  div {
    z-index: 1000;
    border: 1px solid rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.7);
    border-radius: 4px;
    padding: 4px;
    position: absolute;

    color: black;
    font-size: smaller;
    font-weight: bold;
  }
</style>
