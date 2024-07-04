import StatTooltip from './StatTooltip.svelte';

export function statTooltip(element: HTMLElement) {
  let div, title: string, tooltipComponent: StatTooltip;

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

    tooltipComponent = new StatTooltip({
      props: {
        title: title,
        x: event.pageX,
        y: event.pageY,
      },
      target: document.body,
    });
  }
  function mouseMove(event: MouseEvent) {
    tooltipComponent.$set({
      x: event.pageX,
      y: event.pageY,
    });
  }
  function mouseLeave() {
    tooltipComponent.$destroy();
    // NOTE: restore the `title` attribute
    element.setAttribute('title', title);
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
}
