import type { KeyboardEventHandler } from "svelte/elements";

export function createKeyPressEvent<T extends EventTarget>(
  onKeyPress: KeyboardEventHandler<T>
) {
  const keyMem: (number | undefined)[] = [];

  return {
    keydownHook: (e: KeyboardEvent & { currentTarget: EventTarget & T }) => {
      if (!keyMem.includes(e.keyCode)) {
        onKeyPress(e);

        const i = keyMem.findIndex(v => v == undefined);
        if(i !== -1) keyMem[i] = e.keyCode
        else keyMem.push(e.keyCode);
      }
    },
    keyupHook: (e: KeyboardEvent & { currentTarget: EventTarget & T }) => {
        keyMem[keyMem.findIndex(v => v == e.keyCode)] = undefined;
    },
  };
}
