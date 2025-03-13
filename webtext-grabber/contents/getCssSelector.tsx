// Improve css selection inspired by https://www.perplexity.ai/search/what-s-the-best-typescript-or-u0dTbpZfSVmEfJGrLWKaxQ
export const getCssSelector = (node: Node): string => {
  if (!node || !node.parentNode) {
      return ''; // Invalid node
  }

  const getNodeIndex = (node: Node): number => {
      let index = 0;
      let sibling = node.previousSibling;
      while (sibling) {
          index++;
          sibling = sibling.previousSibling;
      }
      return index;
  };

  const buildElementPath = (element: Element): string => {
      let path = '';
      let current: Element | null = element;

      while (current && current.nodeType === Node.ELEMENT_NODE) {
          const tagName = current.tagName.toLowerCase();
          const siblings = Array.from(current.parentNode?.children || []);
          const sameTagSiblings = siblings.filter((el) => el.tagName === current.tagName);
          const index = sameTagSiblings.indexOf(current as HTMLElement);

          path = `${tagName}${sameTagSiblings.length > 1 ? `:nth-of-type(${index + 1})` : ''}` + 
                 (path ? ' > ' + path : '');
          current = current.parentElement;
      }

      return path;
  };

  // Find the nearest parent element
  const parentElement = node.parentElement;
  if (!parentElement) {
      return ''; // No valid parent element
  }

  // Build the CSS selector for the parent element
  const parentSelector = buildElementPath(parentElement);

  // Add positional information for the node within its parent's childNodes
  const nodeIndex = getNodeIndex(node);
  return `${parentSelector} > :nth-child(${nodeIndex + 1})`;
}

// Example usage:
const targetNode = document.querySelector('your-selector')?.childNodes[0]; // Replace with your target node
if (targetNode) {
  console.log(getCssSelectorForNode(targetNode));
}
