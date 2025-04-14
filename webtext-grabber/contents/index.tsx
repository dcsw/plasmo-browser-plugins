import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import { checkPageElement } from '../contents_utils/checkPageElement'
import { clickPageElement } from '../contents_utils/clickPageElement'
import { waitForDOMUpdate } from '../contents_utils/waitForDOMChange'
import { selectPageNode } from '../contents_utils/selectPageElement'
import { screenCapture } from '../contents_utils/screenCapture-html2canvas'

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    all_frames: true,
    // world: "MAIN",
    run_at: "document_idle"
}

const handleContentMessages = () => {
    const { data } = useMessage<string, string>(async (req, res) => {
    try {  
        switch (req.name) {
            case "checkPageElement":
                await checkPageElement(req, res); break
            case "clickPageElement":
                await clickPageElement(req, res); break
            case "waitForDOMChange":
                await waitForDOMUpdate(req, res); break
            case "selectPageElement":
                await selectPageNode(req, res); break
            case "screenCapture-html2canvas":
                await screenCapture(req, res); break
            default:
                res.send(null); break;
        }
    } catch(e) {
        res.send(JSON.stringify({ error: e }))
    }
    })
}

export default handleContentMessages