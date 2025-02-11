import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import { checkPageElement } from './checkPageElement'
import { selectPageElement } from './selectPageElement'
import { screenCapture } from './screenCapture-html2canvas'

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    all_frames: true,
    // world: "MAIN",
    run_at: "document_idle"
}

const handleContentMessages = () => {
    const { data } = useMessage<string, string>(async (req, res) => {
        switch (req.name) {
            case "checkPageElement":
                await checkPageElement(req, res); break
            case "selectPageElement":
                await selectPageElement(req, res); break
            case "screenCapture-html2canvas":
                await screenCapture(req, res); break
            default:
                res.send(null); break;
        }
    })
}

export default handleContentMessages