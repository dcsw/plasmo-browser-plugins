import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import html2canvas from './html2canvas.min';

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  // world: "MAIN" // unnecessary, possibly dangerous
}

const screenCapture = () => {
  const { data } = useMessage<string, string>(async (req, res) => {
    if (req.name === "screenCapture-html2canvas") {
      try {
        const dataUrl = await captureFullPage(req.body.selector)
        if (!dataUrl.match(/^data\:/)) throw new Error("Error: ", dataUrl);
        res.send(JSON.stringify({ url: document.location.href, title: document.title, screenshotUrl: dataUrl }))
      } catch (error) {
        res.send(JSON.stringify(error))
      }
    }
    return true
  })
}

const captureFullPage = async (selector: string) => {
  const element: HTMLElement = document.querySelector(selector);
  if (element) {
    const canvas = await html2canvas(element, {
      // NOT setting these captures the element's full size
      // width: window.outerWidth,
      // height: window.outerHeight,
      // width: document.documentElement.clientWidth,
      // height: document.documentElement.clientHeight,
      allowTaint: true,
      logging: true,
      useCORS: true,
      imageTimeout: 100,
      foreignObjectRendering: false // setting this to true has been found to fail here: https://help.mulesoft.com/s/article/How-to-troubleshoot-sporadic-disconnections-of-on-premise-Mule-servers-from-Anypoint-Runtime-Manager
    })
    // Now use canvas
    const imageURL = await canvas.toDataURL('image/png');
    return imageURL;
  }
  return null;
}

export default screenCapture