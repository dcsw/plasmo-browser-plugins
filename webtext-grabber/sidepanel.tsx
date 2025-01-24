import React, { useState, useRef } from "react"
import { type PlasmoMessaging, sendToContentScript, sendToBackground } from "@plasmohq/messaging"
import { InfiniteScroller } from "components/infinite-scroller"
import { Carousel } from 'components/carousel'
import 'assets/styles.css'
import ExpanderButton from 'components/settings-expander'
import { makeDoc } from './DocxGenerator';

function showWaitCursor() {
  document.documentElement.classList.add('wait-cursor');
}

function hideWaitCursor() {
  document.documentElement.classList.remove('wait-cursor');
}

const IndexPopup = () => {
  const [selector, setSelector] = useState("html")
  const [welcomeUrl] = useState(`chrome-extension://${chrome.runtime.id}/tabs/welcome.html`)
  const carousel = useRef(null)
  const errorScroller = useRef(null)
  const [haveErrors, setHaveErrors] = useState(false)
  const [downloadHref, setDownloadHref] = useState(null)
  const [newData, setNewData] = useState(false)

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
      showWaitCursor()
      const fullPageDataUrl = await captureFullPageScreenshot()
      if (!fullPageDataUrl.match(/.*data\:/)) throw (fullPageDataUrl) // condition hack to detect content script exception
      const resultObj = JSON.parse(fullPageDataUrl)
      await carousel.current.addNewTextBlob(resultObj);

      // Use setTimeout to allow the list of screenshots to re-render before setting a new download href
      // setTimeout(async () => { await generateDocx() }, 0);
      setNewData(true)
      setDownloadHref("")
    } catch (error) {
      setHaveErrors(true)
      const err = error instanceof Error ? error : JSON.parse(error)
      const errorDiv = document.createElement('div')
      errorDiv.innerText = err.stack
      errorScroller.current.addNewTextBlob("Error", errorDiv.outerHTML);
    } finally {
      hideWaitCursor()
    }
  }

  const generateDocx = async (e) => {
    if (newData) {
      e.preventDefault()
      const buffer = await makeDoc('.mySwiperMainView')
      // Use the buffer (e.g., save to file or send as response)
      const blob = new Blob([buffer], { type: 'application/octet-binary' })
      // const link = document.querySelector('.downloadLink') as HTMLAnchorElement
      // link.href = URL.createObjectURL(blob)
      // link.download = "filename.docx"; // Specify the desired filename
      setDownloadHref(URL.createObjectURL(blob))
      setNewData(false)
      // Click the link after React updates its href
      setTimeout(() => {
        const link = document.querySelector('.downloadLink') as HTMLAnchorElement
        link.click()
      }, 0);
    }
  }

  return (
    <div>
      <a className="welcome" href={welcomeUrl} target="_blank">Welcome!</a>
      <ExpanderButton className="settings" summary={""}>
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
      <a className="downloadLink" href={downloadHref} onClick={generateDocx} download="filename.docx">Download Document</a>
      <br />
      <Carousel ref={carousel}></Carousel>
    </div >
  )
}

export default IndexPopup