import { useState } from "react"
import { default as InfiniteScroller  } from "components/infinite-scroller"

import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"

function IndexPopup() {
  const [txHash, setTxHash] = useState(undefined)
  const [txInput, setTxInput] = useState(0)
  const [selector, setSelector] = useState("body")

  const [csResponse, setCsData] = useState("")
  const [welcomeUrl] = useState(`chrome-extension://${chrome.runtime.id}/tabs/welcome.html`)

  return (
    <div>
      <input
        type="number"
        value={txInput}
        onChange={(e) => setTxInput(e.target.valueAsNumber)}
      />

      <button
        onClick={async () => {
          const resp = await sendToBackground({
            name: "hash-tx",
            body: {
              input: txInput
            }
          })
          setTxHash(resp)
        }}>
        Hash TX
      </button>

      <p>TX HASH: {txHash}</p>
      <hr />

      <input value={selector} onChange={(e) => setSelector(e.target.value)} />

      <button
        onClick={async () => {
          const csResponse = await sendToContentScript({
            name: "query-selector-text",
            body: selector
          })
          setCsData(csResponse)
        }}>
        Query Text on Web Page
      </button>
      <br />
      <label>Text Data:</label>
      {/* <p>{csResponse}</p> */}
      <InfiniteScroller></InfiniteScroller>
      <footer><a href={welcomeUrl} target="_blank">Welcome!</a></footer>
    </div>
  )
}

export default IndexPopup