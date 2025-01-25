import React, { useState, useRef } from "react"
import { type PlasmoMessaging, sendToContentScript, sendToBackground } from "@plasmohq/messaging"
import { CiSettings } from "react-icons/ci"
import { RiCameraLine } from "react-icons/ri"
import { RiCameraAiLine } from "react-icons/ri"
import { HiOutlineDocumentDownload } from "react-icons/hi"
import { GoShare } from "react-icons/go"
import { InfiniteScroller } from "components/infinite-scroller"
import { Carousel } from 'components/carousel'
import ExpanderButton from 'components/settings-expander'
import { makeDoc } from './DocxGenerator';
import 'assets/styles.css'

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
  const [downloadRef] = useState(null)
  const [shareRef] = useState(null)
  const [newData, setNewData] = useState(false)
  const [filename, setFilename] = useState("filename.docx")

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
      downloadRef.classList.remove('hidden')
      shareRef.classList.remove('hidden')
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

  const multiShotPage = async () => {
    alert("Multishot not implemented...yet.")
  }

  const share = async () => {
    alert("Share not implemented...yet.")
  }

  const generateDocx = async (e) => {
    if (newData) {
      e.preventDefault()
      const buffer = await makeDoc('.mySwiperMainView')
      const blob = new Blob([buffer], { type: 'application/octet-binary' })
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
    <div className="bg-image">
      <a className="welcome" href={welcomeUrl} target="_blank">Welcome!</a>
      <ExpanderButton className="settings" summary={""}>
        <div>Settings</div>
        <input value={selector} onChange={async (e) => setSelector(e.target.value)} />
        <details open>
          <summary className={`${'errors' + (haveErrors ? ' some' : ' none')}`}>Errors</summary>
          <InfiniteScroller ref={errorScroller}></InfiniteScroller>
        </details>
      </ExpanderButton>

      <RiCameraLine className="capture" onClick={screenShotPage} />
      <RiCameraAiLine className="multiCapture" onClick={multiShotPage} />

      { // show when there is data
        downloadHref !== null &&
        <span>
          <a className="downloadLink" ref={downloadRef} href={downloadHref} onClick={generateDocx} download={filename}>
            <HiOutlineDocumentDownload className="download" />
          </a>
          <GoShare className="share" onClick={share} />
        </span>
      }
      <Carousel ref={carousel}></Carousel>
    </div >
  )
}

export default IndexPopup