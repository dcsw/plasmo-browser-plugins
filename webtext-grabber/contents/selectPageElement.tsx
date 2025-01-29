import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  // world: "MAIN"
}

let currentNode: HTMLElement | null = null; // stores the currently highlighted DOM element.

const mouseOverHandler = (event) => {
  let target = event.target as HTMLElement;
  if (currentNode && currentNode !== target) // remove previous highlight  
    outlineRemove();
  currentNode = target
  if (target.matches('*'))      // Add a new purple bounding box around hovered elements dynamically   
    highlightNodes(target);
  currentNode.addEventListener('click', mouseClickHandler)
}

const mouseOutHandler = (event) => {   // remove previous highlights when mouse exits an element         
  let target = event.relatedTarget as HTMLElement;
  if (currentNode && !target) {
    outlineRemove();
  }
}

const mouseClickHandler = (event) => {   // remove previous highlights when mouse exits an element         
  let clickedElement = event.target as HTMLElement;
  if (currentNode && currentNode === clickedElement) {
    currentNode.removeEventListener("click", mouseClickHandler)
    outlineRemove();
    if (mouseOverHandler) document.removeEventListener("mouseover", mouseOverHandler)
    if (mouseOutHandler) document.removeEventListener("mouseout", mouseOutHandler)
    // browser.runtime.sendMessage({ selector: `#${clickedElement.id}` });  // return the selector of last selected node in message
  // complete Promise and respond....
  }
}

// Function for adding a purple bounding box around elements 
const highlightNodes = (node: Node | null = document.body) => {
  if (node === null || !(node instanceof HTMLElement)) return;
  node.style.outline = "5px solid purple";
  // for (let child of Array.from(node.children)) highlightNodes(child);
}

// Function to remove the existing bounding box  
const outlineRemove = () => {
  if (currentNode) currentNode.style.outline = "none";
  currentNode = null;
}

const selectPageElement = () => {
  const { data } = useMessage<string, string>(async (req, res) => {
    if (req.name === "selectPageElement") {
      try {
        document.addEventListener('mouseover', mouseOverHandler)
        document.addEventListener('mouseout', mouseOutHandler)
        // res.send() here
      } catch (error) {
        res.send(JSON.stringify(error))
      }
    }
    return true
  })
}

export default selectPageElement