export const getCssSelector = (node: Node): string => {
  if (!(node instanceof Element)) {
    return '';
  }

  const path: string[] = [];
  let element = node as Element;

  while (element && element.nodeType === Node.ELEMENT_NODE) {
    let selector = element.nodeName.toLowerCase();

    if (element.id) {
      selector = `#${element.id}`;
      path.unshift(selector);
      break;
    } else {
      let sib = element;
      let nth = 1;
      while (sib.previousSibling) {
        sib = sib.previousSibling as Element;
        if (sib.nodeType === Node.ELEMENT_NODE && sib.nodeName.toLowerCase() === selector) {
          nth++;
        }
      }

      if (nth > 1) {
        selector += `:nth-of-type(${nth})`;
      }
    }

    path.unshift(selector);
    element = element.parentNode as Element;
  }

  return path.join(' > ');
}
