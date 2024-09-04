import type { PlasmoCSConfig } from "plasmo"

import { useMessage } from "@plasmohq/messaging/hook"

export const config: PlasmoCSConfig = {
  all_frames: true
}

const captureStyledHTML = (el) => {
  // (async () => await inlineExternalStyles())();
  inlineExternalStyles();
  const elements = document.getElementsByTagName('*');
  for (let element of elements) {
    const styles = window.getComputedStyle(element);
    let inlineStyles = '';
    for (let prop of styles) {
      inlineStyles += `${prop}:${styles.getPropertyValue(prop)};`;
    }
    element.setAttribute('style', inlineStyles);
  }
  return document.documentElement.outerHTML;
}

// const inlineExternalStyles = async () => {
//   const styleSheets = Array.from(document.styleSheets);
//   for (let sheet of styleSheets) {
//     if (sheet.href) {
//       try {
//         fetch(sheet.href).then((response) => {
//           response.text().then((cssText) => {
//             const style = document.createElement('style');
//             style.textContent = cssText;
//             document.head.appendChild(style);
//             console.log('meeeeh', sheet.href)
//           })
//         });
//       } catch (error) {
//         console.error('Error fetching stylesheet:', error);
//       }
//     }
//   }
// }

const inlineExternalStyles = () => {
  const styleSheets = Array.from(document.styleSheets);
  for (let sheet of styleSheets) {
    if (sheet.href) {
      try {
        const response = (async () => await fetch(sheet.href))()
        const cssText = (async () => await response.text())();
        const style = document.createElement('style');
        style.textContent = cssText;
        document.head.appendChild(style);
        console.log('meeeeh', sheet.href)
      } catch (error) {
        console.error('Error fetching stylesheet:', error);
      }
    }
  }
}

const convertImagesToDataURLs = () => {
  const images = document.getElementsByTagName('img');
  for (let img of images) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    img.src = canvas.toDataURL();
  }
}

const QueryTextAnywhere = () => {
  const { data } = useMessage<string, string>((req, res) => {
    const el = document.querySelector(req.body);
    let styledHTML = captureStyledHTML(el);
    res.send(styledHTML);
    // return (<div></div>)
  })
  //   return (
  //     <div
  //       style={{
  //         padding: 8,
  //         background: "#333",
  //         color: "red"
  //       }}>
  //       Querying Selector for: {data}
  //     </div>
  //   )
}

export default QueryTextAnywhere
