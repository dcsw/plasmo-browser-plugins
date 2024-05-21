import contentsClientHubMainWorld from "url:../../../contents/client-hub-main-world"
import contentsMainWorld from "url:../../../contents/main-world"
chrome.scripting.registerContentScripts([
  {"id":"contentsClientHubMainWorld","js":[contentsClientHubMainWorld.split("/").pop().split("?")[0]],"matches":["<all_urls>"],"world":"MAIN"},
  {"id":"contentsMainWorld","js":[contentsMainWorld.split("/").pop().split("?")[0]],"matches":["<all_urls>"],"runAt":"document_start","world":"MAIN"}
]).catch(_ => {})
