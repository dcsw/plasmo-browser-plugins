import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import html2canvas from './html2canvas.min';
import { existsSync } from "fs";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  // world: "MAIN",
  run_at: "document_idle"
}

const checkPageElement = () => {
  const { data } = useMessage<string, string>(async (req, res) => {
    if (req.name === "checkPageElement") {
      try {
        const exists = await document.querySelector(req.body.sel) ? true : false
        res.send(JSON.stringify({ exists: exists }))
      } catch (error) {
        res.send(JSON.stringify(error))
      }
    } else {
      // res.send(JSON.stringify({ exists: false }))
    }
  })
}

export default checkPageElement