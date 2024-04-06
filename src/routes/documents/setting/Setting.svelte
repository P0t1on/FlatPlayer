<script lang="ts">
  import type { ComponentType, SvelteComponent } from 'svelte';
  import SimpleBool from './formats/SimpleBool.svelte';

  const settings: {
    id: string;
    title: string;
    format: ComponentType<SvelteComponent<{ value?: any }>>;
    value: any;
  }[] = [
    {
      id: 'enableMultiplayer',
      title: '멀티플레이어',
      format: SimpleBool,
      value: false,
    },
  ];
</script>

<article id="setting">
  <ul class="settingList">
    {#each settings as { format, value }, i (i)}
      <li>
        <svelte:component this={format} bind:value />
      </li>
    {/each}
  </ul>
</article>

<style lang="scss" module>
  ul.settingList {
    list-style: none;
    padding: 8px 40px 16px 40px;

    li {
      padding: 8px 8px 8px 12px;
      margin: 8px 0 8px 0;
      background-color: gray;
    }
  }
</style>
