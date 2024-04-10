<script lang="ts">
  import { onMount, type ComponentType, type SvelteComponent } from 'svelte';
  import SimpleBool from './formats/SimpleBool.svelte';

  let settings: {
    id: string;
    title: string;
    description: string;
    format: ComponentType<
      SvelteComponent<
        {
          title: string;
          description: string;
          experimental: boolean;
          value: any;
        },
        { change: CustomEvent<any> }
      >
    >;
    value: any;
    type: 'string' | 'number' | 'boolean';
    experimental: boolean;
  }[] = [
    {
      id: 'enableMultiplayer',
      title: '멀티플레이어',
      description: '이 설정으로 멀티플레이어 기능을 활성화할 수 있습니다.',
      format: SimpleBool,
      value: false,
      type: 'boolean',
      experimental: true,
    },
    {
      id: 'enableMultiplayer1',
      title: '멀티플레이어',
      description: '',
      format: SimpleBool,
      value: false,
      type: 'boolean',
      experimental: false,
    },
  ];

  export let isChanged = false;
  let changedConfig: { [key: string]: any } = {};

  const onValueChange = (id: string) => (e: CustomEvent<any>) => {
    changedConfig[id] = e.detail;
    if (!isChanged) isChanged = true;
  };

  const applyConfig = () => {
    for (const id in changedConfig) {
      localStorage.setItem('config_' + id, changedConfig[id]);
    }

    isChanged = false;
    location.reload();
  };

  onMount(() => {
    changedConfig = {};

    for (const config of settings) {
      const bVal = localStorage.getItem('config_' + config.id);

      if (bVal !== null) {
        config.value = bVal;
        switch (config.type) {
          case 'boolean': {
            config.value = JSON.parse(bVal);
            break;
          }
          case 'number': {
            config.value = Number.parseFloat(bVal);
            break;
          }
          case 'string': {
            config.value = bVal;
            break;
          }
        }
      }
    }
    settings = settings;
  });
</script>

<svelte:window
  on:beforeunload={(e) => {
    if (isChanged) e.preventDefault();
  }}
/>

<article id="setting">
  {#if isChanged}
    <button id="applySetting" on:click={applyConfig}>
      변경된 설정 적용하기
    </button>
  {/if}
  <ul class="settingList">
    {#each settings as { id, format, type, ...args }, i (i)}
      <li>
        <svelte:component
          this={format}
          {...args}
          on:change={onValueChange(id)}
        />
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

      user-select: none;
    }
  }

  button#applySetting {
    position: relative;
    top: 16px;
    left: 32px;
    background-color: transparent;
    border: none;

    cursor: pointer;
  }
</style>
