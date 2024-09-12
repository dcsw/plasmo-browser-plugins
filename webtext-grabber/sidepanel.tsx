import React, { useState, useEffect, useRef } from "react"
import { sendToContentScript } from "@plasmohq/messaging"
import { InfiniteScroller } from "components/infinite-scroller"
// import captureFullPageScreenshot from "components/captureFullPageScreenshot"

const IndexPopup = () => {
  const [selector, setSelector] = useState("html")

  // const [csResponse, setCsData] = useState("")
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
          // chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 100 }, function (dataUrl) {
          //   // This will capture a JPEG image at 50% quality
          //   let img = document.createElement('img');
          //   img.src = dataUrl;
          //   // document.body.appendChild(img);
          //   infiniteScroller.current.addNewTextBlob("Capture", img.outerHTML);
          // });
          // chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          //   let currentTabId = tabs[0].id;

          //   const img = await captureFullPageScreenshot()
          //   infiniteScroller.current.addNewTextBlob("Capture", img.outerHTML);
          // });


          // chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          //   let currentTabId = tabs[0].id;
            // captureFullPageScreenshot(currentTabId)
            //   .then(fullPageDataUrl => {
            //     // Create a link to download the image
            //     const link = document.createElement('a');
            //     link.href = fullPageDataUrl;
            //     link.download = 'full_page_screenshot.png';
            //     document.body.appendChild(link);
            //     link.click();
            //     document.body.removeChild(link);
            //     infiniteScroller.current.addNewTextBlob("Capture", link);
            //   })
            //   .catch(error => {
            //     console.error("Failed to capture full page screenshot:", error)
            //   });

            async function captureFullPageScreenshot(): Promise<string> {
              const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
              return await sendToContentScript({
                name: "screenCapture",
                tabId: tab.id
              });
            }

            // Usage
            captureFullPageScreenshot()
              .then(fullPageDataUrl => {
                // // Create a link to download the image
                // const link = document.createElement('a');
                // link.href = fullPageDataUrl;
                // link.download = 'full_page_screenshot.png';
                // document.body.appendChild(link);
                // link.click();
                // document.body.removeChild(link);
                // infiniteScroller.current.addNewTextBlob("Capture", link.outerHTML);

                let img = document.createElement('img');
                img.src = fullPageDataUrl;
                // document.body.appendChild(img);
                infiniteScroller.current.addNewTextBlob("Capture", img.outerHTML);
              })
              .catch(error => {
                console.error("Failed to capture full page screenshot:", error)
              });

          // })





          // const img = await captureFullPageScreenshot()
          // infiniteScroller.current.addNewTextBlob("Capture", img.outerHTML);

          // sendToContentScript({
          //   name: "get-snapshot",
          //   body: selector
          // }).then((csResponse) => {
          //   setCsData(csResponse);
          //   // infiniteScroller.current.addNewTextBlob("Capture", csResponse);
          // })
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