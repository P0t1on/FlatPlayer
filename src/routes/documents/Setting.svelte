<script lang="ts">
  import { onMount } from 'svelte';

  const settings = [
    {
      id: 'enableMultiplayer',
      name: '멀티플레이어',
      type: 'boolean',
      defaultValue: false,
      experimental: true,
    },
    {
      id: 'enableMultiplayer2',
      name: '멀티플레이어',
      type: 'boolean',
      defaultValue: false,
      experimental: true,
    },
  ];

  const onBoolChange = (id: string) => (e: Event) => {
    // @ts-ignore
    const value = e.target.checked as boolean;
    localStorage.setItem('setting_' + id, value + '');
  };

  onMount(() => {
    for (const setting of settings) {
      const prevVal = localStorage.getItem(setting.id);
      if (prevVal === undefined) continue;

      switch (setting.type) {
        case 'boolean': {
          setting.defaultValue = new Boolean(prevVal) as boolean;
          break;
        }
      }
    }
  });
</script>

<article id="setting">
  <ul class="settingList">
    {#each settings as { id, name, type, experimental, defaultValue }, i (i)}
      <li>
        {name} &nbsp;
        {#if type === 'boolean'}
          <input
            type="checkbox"
            on:change={onBoolChange(id)}
            bind:checked={defaultValue}
          />
        {/if}
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
