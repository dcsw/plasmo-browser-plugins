import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import html2canvas from 'html2canvas';

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const screenCapture = () => {
  const { data } = useMessage<string, string>(async (req: any, res) => {
    try {
      const dataUrl = await captureFullPage(req.selector)
      res.send(dataUrl)
    } catch (error) {
      res.send(error.message)
    }
  })
  return (<div></div>);
}

async function captureFullPage(selector: string): Promise<string> {
  const element: HTMLElement = document.querySelector(selector);
  if (element) {
    const canvas :HTMLCanvasElement = await html2canvas(element)
      const image = await canvas.toDataURL('image/png');
      return image;
  }
  return null;
}

export default screenCapture