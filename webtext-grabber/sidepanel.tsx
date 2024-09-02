import { useState, useEffect, useRef } from "react"
import { InfiniteScroller } from "components/infinite-scroller"
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"

const IndexPopup = () => {
  const [txHash, setTxHash] = useState(undefined)
  const [txInput, setTxInput] = useState(0)
  const [selector, setSelector] = useState("body")

  const [csResponse, setCsData] = useState("")
  const [welcomeUrl] = useState(`chrome-extension://${chrome.runtime.id}/tabs/welcome.html`)

  const infiniteScroller = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    const generateLoremIpsum = (length) => {
      const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      let result = '';
      while (result.length < length) {
        result += lorem;
      }
      return result.slice(0, length);
    };

    // infiniteScroller.current.addNewTextBlob(generateLoremIpsum(1000)); // Add initial text blob...

    intervalRef.current = setInterval(() => {
      infiniteScroller.current.addNewTextBlob(generateLoremIpsum(1000));
    }, 100) as any; // 0.1 second

    // Stop after 2.5 seconds
    const timeout = setTimeout(() => {
      clearInterval(intervalRef.current);
    }, 2500);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeout);
    };
    // }, [addNewTextBlob]);
    // }, [items.length]);
  }, []); // empty deps array makes useEffect() only trigger 1x on initial render

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
      <InfiniteScroller ref={infiniteScroller}></InfiniteScroller>
      <footer><a href={welcomeUrl} target="_blank">Welcome!</a></footer>
    </div>
  )
}

export default IndexPopup