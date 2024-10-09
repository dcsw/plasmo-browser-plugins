import React, { useState, useRef } from "react"
import { type PlasmoMessaging, sendToContentScript, sendToBackground } from "@plasmohq/messaging"
import { InfiniteScroller } from "components/infinite-scroller"
import 'assets/styles.css'
import ExpanderButton from 'components/settings-expander'
import CoverArtFlow from 'components/cover-art-flow'

const IndexPopup = () => {
  const [selector, setSelector] = useState("html")
  const [welcomeUrl] = useState(`chrome-extension://${chrome.runtime.id}/tabs/welcome.html`)
  const infiniteScroller = useRef(null)
  const errorScroller = useRef(null)
  const coverArtFlow = useRef(null)
  const [haveErrors, setHaveErrors] = useState(false)

  const screenShotPage = async () => {
    const captureFullPageScreenshot = async (): Promise<string> => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        const str = await sendToContentScript({
          name: "screenCapture-html2canvas",
          tabId: tab.id,
          body: {
            selector: selector
          }
        });
        if (str.match(/.*data\:\,/)) throw (str) // condition hack to detect empty data:, url
        return str;
      } catch (e) {
        // Capture what we can. Note that captureVisibleTab() only captures what's visible, not the entire element.
        console.log(`Unable to capture full element for selector '${selector}' -- reverting to visible screenshot.`)
        const fullPageDataUrl = await chrome.tabs.captureVisibleTab()
        const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
        const t = tabs[0]
        const resultObj = { title: t.title, url: t.url, screenshotUrl: fullPageDataUrl }
        return Promise.resolve(JSON.stringify(resultObj))
      }
    }

    // Usage
    try {
      const fullPageDataUrl = await captureFullPageScreenshot()
      if (!fullPageDataUrl.match(/.*data\:/)) throw (fullPageDataUrl) // condition hack to detect content script exception
      const resultObj = JSON.parse(fullPageDataUrl)
      const div = document.createElement('div')
      div.innerHTML = `
      <details>
        <summary>${resultObj.title}</summary>
        <a href=${resultObj.url} target="_blank">${resultObj.title}</a>
        <img src="${resultObj.screenshotUrl}"/>
      </details>
      `
      // infiniteScroller.current.addNewTextBlob(null, div.outerHTML);
      coverArtFlow.current.addItem(div.outerHTML);
    } catch (error) {
      setHaveErrors(true)
      const err = error instanceof Error ? error : JSON.parse(error)
      const errorDiv = document.createElement('div')
      errorDiv.innerText = err.stack
      errorScroller.current.addNewTextBlob("Error", errorDiv.outerHTML);
    }
  }

  return (
    <div>
      <a className="welcome" href={welcomeUrl} target="_blank">Welcome!</a>
      <ExpanderButton className="settings" summary="">
        <div>Settings</div>
        <input value={selector} onChange={async (e) => setSelector(e.target.value)} />
        <details open>
          <summary className={`${'errors' + (haveErrors ? ' some' : ' none')}`}>Errors</summary>
          <InfiniteScroller ref={errorScroller}></InfiniteScroller>
        </details>
      </ExpanderButton>

      <button
        onClick={screenShotPage}>
        Capture Web Page
      </button>
      <br />
      {/* <InfiniteScroller ref={infiniteScroller}></InfiniteScroller> */}
      <CoverArtFlow ref={coverArtFlow}></CoverArtFlow>
    </div >
  )
}

export default IndexPopup