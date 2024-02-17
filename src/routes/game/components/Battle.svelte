<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // props
  export let width = 100,
    height = 100,
    hpColor1 = 'red',
    hpColor2 = 'greenyellow';

  // bindings
  export let hpProgress = writable(50);

  const dispatch = createEventDispatcher();

  onMount(() => {});
</script>

<article id="battle" style={`width:${width}px; height:${height}px`}>
  <div id="health">
    <slot
      name="hp1"
      class="hp"
      style={`width:${$hpProgress}%; background: ${hpColor1};`}
    />
    <slot
      name="hp2"
      class="hp"
      style={`width:${$hpProgress}%; background: ${hpColor2};`}
    />
  </div>
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
    flex-direction: column;
    position: absolute;

    z-index: 2;
    line-height: 10px;

    color: white;
    background-color: black;
    border: 2px solid gray;

    div {
      border: 2px solid white;

      &#health {
        height: 2.5%;

        display: flex;
        flex-direction: row;

        slot.hp {
          border: none;
        }
      }

      &#field {
        height: 25%;
      }

      &#actions {
        height: 32.5%;
      }

      &#etc {
        height: 40%;

        display: flex;
        flex-direction: row;

        div {
          border: 2px solid gray;
          width: 50%;
        }
      }
    }
  }
</style>
