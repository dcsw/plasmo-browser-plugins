import React, { useState, useRef } from "react"
import { type PlasmoMessaging, sendToContentScript, sendToBackground } from "@plasmohq/messaging"
import { InfiniteScroller } from "components/infinite-scroller"
import 'assets/styles.css'
import ExpanderButton from 'components/settings-expander'

const IndexPopup = () => {
  const [selector, setSelector] = useState("html")
  const [welcomeUrl] = useState(`chrome-extension://${chrome.runtime.id}/tabs/welcome.html`)
  const infiniteScroller = useRef(null)
  const errorScroller = useRef(null)

  const screenShotPage = async () => {
    const captureFullPageScreenshot = async (): Promise<string> => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      return await sendToContentScript({
        name: "screenCapture-html2canvas",
        tabId: tab.id,
        body: {
          selector: selector
        }
      });
    }

    // Usage
    try {
      const fullPageDataUrl = await captureFullPageScreenshot()
      if (!fullPageDataUrl.match(/^data\:/)) throw (fullPageDataUrl) // condition hack to detect content script exception
      let img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.src = fullPageDataUrl;
      infiniteScroller.current.addNewTextBlob("Capture", img.outerHTML);
    } catch (error) {
      const err = JSON.parse(error)
      const errorDiv = document.createElement('div')
      errorDiv.innerText = err.stack
      errorScroller.current.addNewTextBlob("Error", errorDiv.outerHTML);
    }
  }

  return (
    <div>
      <a className="welcome" href={welcomeUrl} target="_blank">Welcome!</a>
      <ExpanderButton summary="">
        <div>Settings</div>
        <input value={selector} onChange={async (e) => setSelector(e.target.value)} />
        <details open>
          <summary>Error</summary>
          <InfiniteScroller ref={errorScroller}></InfiniteScroller>
        </details>
      </ExpanderButton>

      <button
        onClick={screenShotPage}>
        Capture Web Page
      </button>
      <br />
      <InfiniteScroller ref={infiniteScroller}></InfiniteScroller>
    </div >
  )
}

export default IndexPopup