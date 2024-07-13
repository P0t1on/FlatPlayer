import type { Action } from 'svelte/action';
import StatTooltip from './StatTooltip.svelte';

let destroyBefore: ((event?: MouseEvent) => void) | undefined;

export const statTooltip: Action<HTMLElement> = (element) => {
  let title: string, tooltipComponent: StatTooltip;

  let attr = element.getAttribute('title');
  if (attr === null) {
    return {
      destroy() {},
    };
  }

  function mouseOver(event: MouseEvent) {
    // NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
    // remember to set it back on `mouseleave`
    title = attr ?? '';
    element.removeAttribute('title');

    if (destroyBefore !== undefined) destroyBefore();

    tooltipComponent = new StatTooltip({
      props: {
        title: title,
        x: event.pageX,
        y: event.pageY,
      },
      target: document.body,
    });

    destroyBefore = () => {
      tooltipComponent?.$destroy();
      element.setAttribute('title', title);
      destroyBefore = undefined;
    };
  }
  function mouseMove(event: MouseEvent) {
    tooltipComponent?.$set({
      x: event.pageX,
      y: event.pageY,
    });
  }
  function mouseLeave(event?: MouseEvent) {
    tooltipComponent?.$destroy();
    // NOTE: restore the `title` attribute
    element.setAttribute('title', title);
    destroyBefore = undefined;
  }

  element.addEventListener('mouseover', mouseOver);
  element.addEventListener('mouseleave', mouseLeave);
  element.addEventListener('mousemove', mouseMove);

  return {
    destroy() {
      element.removeEventListener('mouseover', mouseOver);
      element.removeEventListener('mouseleave', mouseLeave);
      element.removeEventListener('mousemove', mouseMove);
    },
  };
};
