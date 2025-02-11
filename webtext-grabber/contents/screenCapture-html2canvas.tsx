import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import html2canvas from './html2canvas.min';

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  // world: "MAIN",
  run_at: "document_idle"
}

const screenCapture = () => {
  const { data } = useMessage<string, string>(async (req, res) => {
    if (req.name === "screenCapture-html2canvas") {
      try {
        const dataUrl = await captureFullPage(req.body.selector)
        // const dataUrl = await chrome.tabCapture()
        if (!dataUrl.match(/^data\:/)) throw new Error("Error: " + dataUrl);
        res.send(JSON.stringify({ url: document.location.href, title: document.title, screenshotUrl: dataUrl }))
      } catch (error) {
        res.send(JSON.stringify(error))
      }
    } else {
      // res.send(null)
    }
  })
}

const captureFullPage = async (selector: string) => {
  const element: HTMLElement = document.querySelector(selector);
  if (element) {
    const canvas = await html2canvas(element, {
      // windowWidth: window.outerWidth,
      // windowHeight: window.outerHeight,
      // scale: 1,
      allowTaint: true,
      logging: true,
      useCORS: true,
      // imageTimeout: 0,
      foreignObjectRendering: false
    })
    // Now use canvas
    const imageURL = await canvas.toDataURL('image/png');
    return imageURL;
  }
  return null;
}

export default screenCapture