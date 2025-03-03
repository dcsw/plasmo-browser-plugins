import type { PlasmoCSConfig } from "plasmo"
import html2canvas from './html2canvas.min';

const captureFullPage = async (selector: string) => {
  const element: HTMLElement = document.querySelector(selector);
  if (element) {
    const canvas = await html2canvas(element, {
      // windowWidth: window.outerWidth,
      // windowHeight: window.outerHeight,
      // scale: 1,
      allowTaint: true,
      logging: false,
      useCORS: true,
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
  }
  return null;
}

export const screenCapture = async (req, res) => {
  try {
    const dataUrl = await captureFullPage(req.body.selector)
    // const dataUrl = await chrome.tabCapture()
    if (!dataUrl.match(/^data\:/)) throw new Error("Error: " + dataUrl);
    res.send(JSON.stringify({ url: document.location.href, title: document.title, screenshotUrl: dataUrl }))
  } catch (error) {
    res.send(JSON.stringify(error))
  }
}