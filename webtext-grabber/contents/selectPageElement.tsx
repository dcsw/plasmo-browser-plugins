let currentNode: Node | null = null; // stores the currently highlighted DOM node.
let promiseResolve = null, promiseReject = null, myPromise = null

const mouseOverHandler = (event) => {
  event.preventDefault();
  event.stopPropagation();
  let target = event.target as Node;
  if (currentNode && currentNode !== target) // remove previous highlight  
    outlineRemove();
  currentNode = target
  if (target.matches('*')) highlightNodes(target); // Add a new purple bounding box around hovered nodes dynamically   
  currentNode.addEventListener('click', mouseClickHandler, { capture: true })
}

const mouseOutHandler = (event) => {   // remove previous highlights when mouse exits an node
  event.preventDefault();
  event.stopPropagation();    
  let target = event.relatedTarget as Node;
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
      currentNode.removeEventListener("click", mouseClickHandler)
      outlineRemove();
      document.removeEventListener("mouseover", mouseOverHandler)
      document.removeEventListener("mouseout", mouseOutHandler)

      const getFullSelector = (node: Node): string => {
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
        

      promiseResolve(getFullSelector(currentNode))
    }
  } catch (e) {
    promiseReject(e)
  }
}

// Function for adding a purple bounding box around nodes 
const highlightNodes = (node: Node | null = document.body) => {
  if (node === null || !(node instanceof Node)) return;
  node.style.outline = "3px solid purple";
}

// Function to remove the existing bounding box  
const outlineRemove = () => {
  if (currentNode) currentNode.style.outline = "none";
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
