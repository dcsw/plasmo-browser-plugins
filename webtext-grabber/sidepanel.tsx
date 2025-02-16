import React, { useState, useRef } from "react"
import { type PlasmoMessaging, sendToContentScript, sendToBackground } from "@plasmohq/messaging"
import { RiCameraLine, RiCameraAiLine } from "react-icons/ri"
import { HiOutlineDocumentDownload } from "react-icons/hi"
import { GoShare } from "react-icons/go"
import { ImNext } from "react-icons/im"
import { TiDeleteOutline } from 'react-icons/ti'
import { InfiniteScroller } from "components/infinite-scroller"
import { Carousel } from 'components/carousel'
import ExpanderButton from 'components/settings-expander'
import { makeDoc } from './DocxGenerator'
import 'assets/styles.css'

const showWaitCursor = () => {
  document.documentElement.classList.add('wait-cursor');
}

const hideWaitCursor = () => {
  document.documentElement.classList.remove('wait-cursor');
}

const IndexPopup = () => {
  const [selScreenShot, setSelScreenShot] = useState("html")
  const [nextSelector, setNextSelector] = useState("")
  const [maxCaptures, setMaxCaptures] = useState(5)
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
          selector: selScreenShot
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
      if (downloadRef) downloadRef.classList.remove('hidden')
      if (shareRef) shareRef.classList.remove('hidden')
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
    const checkForPageElement = async (): Promise<string> => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      return await sendToContentScript({
        name: "checkPageElement",
        tabId: tab.id,
        body: { sel: nextSelector }
      });
    }
    const clickPageElement = async (): Promise<string> => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      return await sendToContentScript({
        name: "clickPageElement",
        tabId: tab.id,
        body: { sel: nextSelector }
      });
    }
    try {
      for (let i: number = 0; i < maxCaptures; i++) {
        await screenShotPage()
        const existsObjStr = await checkForPageElement()
        const exists = JSON.parse(existsObjStr).exists
        if (exists) await clickPageElement()
      }
    } catch (error) {
      setHaveErrors(true)
      const err = error instanceof Error ? error : JSON.parse(error)
      const errorDiv = document.createElement('div')
      errorDiv.innerText = err.stack
      errorScroller.current.addNewTextBlob("Error", errorDiv.outerHTML);
    }
  }

  const share = async () => {
    alert("Share not implemented...yet.")
  }

  const captureSelector = async (name): Promise<any> => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    return sendToContentScript({
      name: name,
      tabId: tab.id,
    });
  }

  const getScreenShotSelector = async () => {
    try {
      showWaitCursor()
      const str = await captureSelector("selectPageElement")
      const o = JSON.parse(str)
      // console.log(o)
      setSelScreenShot(o.selector)
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

  const getNextSelector = async () => {
    try {
      showWaitCursor()
      const str = await captureSelector("selectPageElement")
      const o = JSON.parse(str)
      // console.log(o)
      setNextSelector(o.selector)
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
        <br />
        <div className="inputContainer"> {/* New container for input and delete icon */}
          <ImNext className="getSelector" onClick={getScreenShotSelector} />
          <input value={selScreenShot} onChange={async (e) => setSelScreenShot(e.target.value)}></input>
          <TiDeleteOutline className="deleteIcon" onClick={() => setSelScreenShot("")} /> {/* Inside the flex container */}
        </div>
        <br />
        <div className="inputContainer"> {/* New container for input and delete icon */}
          <ImNext className="getSelector" onClick={getNextSelector} />
          <input value={nextSelector} onChange={async (e) => setNextSelector(e.target.value)} />
          <TiDeleteOutline className="deleteIcon" onClick={() => setNextSelector("")} /> {/* Inside the flex container */}
        </div>
        <div className="inputContainer">
          <label>Max Captures</label>
          <input type="number" value={maxCaptures} onChange={async (e) => setMaxCaptures(e.target.value)} min={1} />
        </div>

        <details open>
          <summary className={`${'errors' + (haveErrors ? ' some' : ' none')}`}>Errors</summary>
          <InfiniteScroller ref={errorScroller}></InfiniteScroller>
        </details>
      </ExpanderButton>

      <RiCameraLine className="capture" onClick={screenShotPage} />

      { // Conditionally render based on nextSelector having a value
        nextSelector &&
        <RiCameraAiLine className="multiCapture" onClick={multiShotPage} />
      }


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