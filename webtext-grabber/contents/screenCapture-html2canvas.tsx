import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import html2canvas from './html2canvas.min';

export const config: PlasmoCSConfig = {

}

const screenCapture = () => {
  const { data } = useMessage<string, string>(async (req, res) => {
    if (req.name === "screenCapture-html2canvas") {
      try {
        const dataUrl = await captureFullPage(req.body.selector)
        if (!dataUrl.match(/^data\:/)) throw new Error("Error: ", dataUrl);
        res.send(dataUrl)
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
      width: window.innerHeight,
      height: window.innerHeight,
      // allowTaint: true
    })
    const ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Now use canvas
    const imageURL = await canvas.toDataURL('image/png');
    // window.open(imageURL)
    return imageURL;
  }
  return null;
}

export default screenCapture