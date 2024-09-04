import { useState, useEffect, useRef } from "react"
import { InfiniteScroller } from "components/infinite-scroller"
import { sendToContentScript } from "@plasmohq/messaging"

const IndexPopup = () => {
  const [selector, setSelector] = useState("html")

  const [csResponse, setCsData] = useState("")
  const [welcomeUrl] = useState(`chrome-extension://${chrome.runtime.id}/tabs/welcome.html`)

  const infiniteScroller = useRef(null)

  return (
    <div>
      <details>
        <summary>Settings</summary>
        <input value={selector} onChange={async (e) => setSelector(e.target.value)} />
      </details>

      <button
        onClick={() => {
          sendToContentScript({
            name: "query-selector-text",
            body: selector
          }).then((csResponse) => {
            setCsData(csResponse);
            infiniteScroller.current.addNewTextBlob("Capture", csResponse);
          })
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