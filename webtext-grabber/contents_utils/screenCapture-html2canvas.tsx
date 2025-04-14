import html2canvas from './html2canvas.min';
import * as htmlToImage from 'html-to-image';

const captureFullPage = async (selector: string) => {
  const element: Node = document.querySelector(selector);
  if (element) {
    let fontEmbedCSS = null
    try {
      fontEmbedCSS = await htmlToImage.getFontEmbedCSS(element);
    } catch (e) {
      console.error(e)
    }
    try {
      const imageURL = await htmlToImage.toPng(element, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#FFFFFF", // Prevents transparent background
        height: element.scrollHeight,
        cacheBust: true,
        includeQueryParams: true,
        fontEmbedCSS,
        skipAutoScale: true,
        logging: true,
        imageTimeout: 30000,
        foreignObjectRendering: true,
        scale: 1,
        onclone: (clonedDoc: any) => {
          const svgElements = clonedDoc.querySelectorAll('svg');
          svgElements.forEach((svg) => {
            const bbox = svg.getBoundingClientRect();
            svg.setAttribute('width', bbox.width);
            svg.setAttribute('height', bbox.height);
          });
        }
      })
      return imageURL
    } catch (err) {
      alert('Whoops! My first try failed...trying a different way...' + err.message);
      try {
        const canvas = await html2canvas(element, {
          // windowWidth: window.outerWidth,
          // windowHeight: window.outerHeight,
          // scale: 1,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#FFFFFF", // Prevents transparent background
          height: element.scrollHeight,
          cacheBust: true,
          includeQueryParams: true,
          fontEmbedCSS,
          skipAutoScale: true,
          logging: true,
          imageTimeout: 30000,
          foreignObjectRendering: true,
          scale: 1,
          onclone: (clonedDoc: any) => {
            const svgElements = clonedDoc.querySelectorAll('svg');
            svgElements.forEach((svg) => {
              const bbox = svg.getBoundingClientRect();
              svg.setAttribute('width', bbox.width);
              svg.setAttribute('height', bbox.height);
            });
          }
        })
        // Now use canvas
        const imageURL = await canvas.toDataURL('image/png');
        return imageURL;
      } catch (err) {
        alert('Oops! Something went wrong!' + err.message);
        throw err
      }
    }
  }
  return null;
}

export const screenCapture = async (req, res) => {
  try {
    const dataUrl = await captureFullPage(req.body.selector)
    if (!dataUrl.match(/^data\:/)) throw new Error("Error: " + dataUrl);
    res.send(JSON.stringify({ url: document.location.href, title: document.title, screenshotUrl: dataUrl }))
  } catch (error) {
    res.send(JSON.stringify(error))
  }
}
export default screenCapture