<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { IconNames } from './Util';

  const dispatch = createEventDispatcher<{
    click: number;
  }>();

  export let type: IconNames,
    color: string = 'white',
    size = 24,
    outline: string | undefined = undefined,
    outlineWidth: string | undefined = undefined;

  const pattern: { [key in IconNames]: string } = {
    arrow_drop_down: 'M480-360 280-560h400L480-360Z',
    arrow_drop_up: 'm280-400 200-200 200 200H280Z',
    arrow_left: 'M560-280 360-480l200-200v400Z',
    arrow_right: 'M400-280v-400l200 200-200 200Z',
    close:
      'm256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z',
    delete:
      'M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z',
    done: 'M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z',
    keyboard_arrow_down:
      'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z',
    keyboard_arrow_left:
      'M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z',
    keyboard_arrow_right:
      'M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z',
    keyboard_arrow_up: 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z',
    play: 'M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z',
    search:
      'M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z',
    sports_esports:
      'M182-200q-51 0-79-35.5T82-322l42-300q9-60 53.5-99T282-760h396q60 0 104.5 39t53.5 99l42 300q7 51-21 86.5T778-200q-21 0-39-7.5T706-230l-90-90H344l-90 90q-15 15-33 22.5t-39 7.5Zm16-86 114-114h336l114 114q2 2 16 6 11 0 17.5-6.5T800-304l-44-308q-4-29-26-48.5T678-680H282q-30 0-52 19.5T204-612l-44 308q-2 11 4.5 17.5T182-280q2 0 16-6Zm482-154q17 0 28.5-11.5T720-480q0-17-11.5-28.5T680-520q-17 0-28.5 11.5T640-480q0 17 11.5 28.5T680-440Zm-80-120q17 0 28.5-11.5T640-600q0-17-11.5-28.5T600-640q-17 0-28.5 11.5T560-600q0 17 11.5 28.5T600-560ZM310-440h60v-70h70v-60h-70v-70h-60v70h-70v60h70v70Zm170-40Z',
  };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  height={size}
  viewBox="0 -960 960 960"
  width={size}
  on:click={(e) => dispatch('click', e.detail)}
  role="presentation"
>
  <path
    fill={color}
    stroke={outline}
    stroke-width={outlineWidth}
    d={pattern[type]}
  />
</svg>
