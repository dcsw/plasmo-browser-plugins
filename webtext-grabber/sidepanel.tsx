import { useState, useEffect, useRef } from "react"
import { InfiniteScroller } from "components/infinite-scroller"
import { sendToContentScript } from "@plasmohq/messaging"

const IndexPopup = () => {
  const [selector, setSelector] = useState("body")

  const [csResponse, setCsData] = useState("")
  const [welcomeUrl] = useState(`chrome-extension://${chrome.runtime.id}/tabs/welcome.html`)

  const infiniteScroller = useRef(null)

  return (
    <div>
      <input value={selector} onChange={(e) => setSelector(e.target.value)} />

      <button
        onClick={async () => {
          const csResponse = await sendToContentScript({
            name: "query-selector-text",
            body: selector
          })
          setCsData(csResponse)
          infiniteScroller.current.addNewTextBlob(csResponse);
        }}>
        Query Text on Web Page
      </button>
      <br />
      <label>Text Data:</label>
      <InfiniteScroller ref={infiniteScroller}></InfiniteScroller>
      <footer><a href={welcomeUrl} target="_blank">Welcome!</a></footer>
    </div>
  )
}

export default IndexPopup