<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  export let value: boolean,
    experimental: boolean,
    title: string,
    description: string;

  const dispatch = createEventDispatcher<{
    change: boolean;
  }>();
</script>

<div>
  <big>{title}</big>
  {#if experimental}
    <em><small>- 이 기능은 시험적 기능입니다.</small></em>
  {/if} <br />
  <input
    type="checkbox"
    on:change={(e) => dispatch('change', e.target.checked)}
    checked={value}
  />
  <small>{description}</small>
</div>

<style lang="scss">
  div em small {
    color: rgb(150, 0, 0);
  }
</style>
