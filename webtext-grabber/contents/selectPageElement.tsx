import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  // world: "MAIN"
}

const selectPageElement = () => {
  let currentNode: HTMLElement | null = null; // stores the currently highlighted DOM element.
  let promiseResolve = null, promiseReject = null, myPromise = null

  const mouseOverHandler = (event) => {
    let target = event.target as HTMLElement;
    if (currentNode && currentNode !== target) // remove previous highlight  
      outlineRemove();
    currentNode = target
    if (target.matches('*')) highlightNodes(target); // Add a new purple bounding box around hovered elements dynamically   
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
      document.removeEventListener("mouseover", mouseOverHandler)
      document.removeEventListener("mouseout", mouseOutHandler)

      const getFullSelector = (element) => {
        let selector = "";
        while (element.parentElement) {
          const tag = element.tagName.toLowerCase();
          const id = element.id ? `#${element.id}` : "";
          const classes = element.className ? `.${element.className.split(/\s+/).join(".")}` : "";
          const nthChild = `:nth-child(${Array.from(element.parentElement.children).indexOf(element) + 1})`;
          selector = `${tag}${id}${classes}${nthChild} > ${selector}`;
          element = element.parentElement;
        }
        return selector.slice(0, -3); // Remove the trailing " > "
      }

      promiseResolve(getFullSelector(currentNode))
    }
  }

  // Function for adding a purple bounding box around elements 
  const highlightNodes = (node: Node | null = document.body) => {
    if (node === null || !(node instanceof HTMLElement)) return;
    node.style.outline = "2px solid purple";
  }

  // Function to remove the existing bounding box  
  const outlineRemove = () => {
    if (currentNode) currentNode.style.outline = "none";
  }

  // (async () => {
    const { data } = useMessage<string, string>(async (req, res) => {
      if (req.name === "selectPageElement") {
        try {
          document.addEventListener('mouseover', mouseOverHandler)
          document.addEventListener('mouseout', mouseOutHandler)
          myPromise = await new Promise((resolve, reject) => {
            promiseResolve = resolve;
            promiseReject = reject;
          });
          const o = await myPromise
          res.send(JSON.stringify({ selNext: o, html: o.innerHtml, text: o.innerText }))
        } catch (error) {
          res.send(JSON.stringify(error))
        }
      }
      return true
    })
  // })()
}

export default selectPageElement