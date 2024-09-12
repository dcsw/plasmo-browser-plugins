import React, { useState, useEffect, useRef } from "react"
import { sendToContentScript } from "@plasmohq/messaging"
import { InfiniteScroller } from "components/infinite-scroller"

const IndexPopup = () => {
  const [selector, setSelector] = useState("html")

  const [welcomeUrl] = useState(`chrome-extension://${chrome.runtime.id}/tabs/welcome.html`)

  const infiniteScroller = useRef(null)

  return (
    <div>
      <details>
        <summary>Settings</summary>
        <input value={selector} onChange={async (e) => setSelector(e.target.value)} />
      </details>

      <button
        onClick={async () => {
            async function captureFullPageScreenshot(): Promise<string> {
              const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
              return await sendToContentScript({
                name: "screenCapture-html2canvas",
                tabId: tab.id
              });
            }

            // Usage
            captureFullPageScreenshot()
              .then(fullPageDataUrl => {
                let img = document.createElement('img');
                img.src = fullPageDataUrl;
                infiniteScroller.current.addNewTextBlob("Capture", img.outerHTML);
              })
              .catch(error => {
                console.error("Failed to capture full page screenshot:", error)
              });
        }}>
        Capture Web Page
      </button>
      <br />
      <label>Text Data:</label>
      <InfiniteScroller ref={infiniteScroller}></InfiniteScroller>
      <footer><a href={welcomeUrl} target="_blank">Welcome!</a></footer>
    </div>
  )
}

export default IndexPopup