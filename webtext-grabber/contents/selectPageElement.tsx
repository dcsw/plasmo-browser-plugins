import { getCssSelector } from './getCssSelector'

let currentNode: Node | null = null; // stores the currently highlighted DOM node.
let promiseResolve = null, promiseReject = null, myPromise = null

const mouseOverHandler = (event) => {
  // event.preventDefault();
  // event.stopPropagation();
  let target: Node = event.target as HTMLElement;
  if (currentNode && currentNode !== target) // remove previous highlight  
    outlineRemove();
  currentNode = target
  if ((target as Element)?.tagName.match('*')) highlightNodes(target); // Add a new purple bounding box around hovered nodes dynamically   
  currentNode.addEventListener('click', mouseClickHandler, { capture: false })
}

const mouseOutHandler = (event) => {   // remove previous highlights when mouse exits an node
  // event.preventDefault();
  // event.stopPropagation();
  let target = event.relatedTarget as Node;
  currentNode.removeEventListener('click', mouseClickHandler, { capture: false })
  if (currentNode && !target) {
    outlineRemove();
  }
}

const mouseClickHandler = (event) => {   // remove previous highlights when mouse exits an node    
  try {
    event.preventDefault();
    event.stopPropagation();
    let clickedNode = event.target as Node;
    if (currentNode && currentNode === clickedNode) {
      currentNode.removeEventListener("click", mouseClickHandler, { capture: false })
      outlineRemove();
      document.removeEventListener("mouseover", mouseOverHandler, { capture: false })
      document.removeEventListener("mouseout", mouseOutHandler, { capture: false })
      promiseResolve(getCssSelector(currentNode))
    }
  } catch (e) {
    promiseReject(e)
  }
}

// Function for adding a purple bounding box around nodes 
const highlightNodes = (node: Node | null = document.body) => {
  if (node === null || !(node instanceof Node)) return;
  (node as HTMLElement).style.outline = "4px solid purple";
}

// Function to remove the existing bounding box  
const outlineRemove = () => {
  if (currentNode) (currentNode as HTMLElement).style.outline = "none";
}

export const selectPageNode = async (req, res) => {
  try {
    document.addEventListener('mouseover', mouseOverHandler, { capture: false })
    document.addEventListener('mouseout', mouseOutHandler, { capture: false })
    myPromise = await new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    const o = await myPromise
    res.send(JSON.stringify({ selector: o, html: o.innerHtml, text: o.innerText }))
  } catch (error) {
    res.send(JSON.stringify(error))
  }
}
