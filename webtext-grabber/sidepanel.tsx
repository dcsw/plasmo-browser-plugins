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
import { table } from "console"

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
    const checkForPageElement = async (tab): Promise<string> => {
      return await sendToContentScript({
        name: "checkPageElement",
        tabId: tab.id,
        body: { sel: nextSelector }
      });
    }
    const clickPageElement = async (tab): Promise<string> => {
      return await sendToContentScript({
        name: "clickPageElement",
        tabId: tab.id,
        body: { sel: nextSelector }
      })
    }
    const waitForDOMUpdate = async (tab): Promise<string> => {
      return await sendToContentScript({
        name: "waitForDOMUpdate",
        tabId: tab.id
      })
    }
    try {
      for (let i: number = 0; i < maxCaptures; i++) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        await screenShotPage()
        const existsObjStr = await checkForPageElement(tab)
        const exists = JSON.parse(existsObjStr).exists
        if (exists) {
          await clickPageElement(tab)
          await waitForDOMUpdate(tab)
        }
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
      <ExpanderButton className="settings" heading="" hover="Click for Settings">
        <div className="inputContainer"> {/* New container for input and delete icon */}
          <span className="settingNameSection">
            <label title="Choose area to screenshot.">Screenshot</label>
            <ImNext className="getSelector" onClick={getScreenShotSelector} />
          </span>
          <input className="settingInput" value={selScreenShot} onChange={async (e) => setSelScreenShot(e.target.value)}></input>
          <TiDeleteOutline className="deleteIcon" onClick={() => setSelScreenShot("")} /> {/* Inside the flex container */}
        </div>
        <div className="inputContainer"> {/* New container for input and delete icon */}
          <span className="settingNameSection">
            <label title="Select button or area to click on to go to the next page or content view.">Next</label>
            <ImNext className="getSelector" onClick={getNextSelector} />
          </span>
          <input className="settingInput" value={nextSelector} onChange={async (e) => setNextSelector(e.target.value)} />
          <TiDeleteOutline className="deleteIcon" onClick={() => setNextSelector("")} /> {/* Inside the flex container */}
        </div>
        <div className="inputContainer">
          <label className="settingNameSection">Max Captures</label>
          <input className="settingInput settingNumeric" type="number" value={maxCaptures} onChange={async (e) => setMaxCaptures(e.target.value)} min={1} />
        </div>

        <details className="inputContainer" open>
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