import { checkForListeners, removeAllListeners } from './eventsTracker'
// import { getCssSelector } from './getCssSelector'

// // Inject this script into the page context
// const injectScript = `
// document.addEventListener('dispatchClickEvent', function(event) {
//   const { sel } = event.detail;
//   const element = document.querySelector(sel);
//   if (element) {
//     element.dispatchEvent(new MouseEvent('click'));
//   }
// });
// `;

// // Content script code to inject the listener
// function injectClickDispatcher() {
//   const script = document.createElement('script');
//   script.textContent = injectScript;
//   document.body.appendChild(script);
// }
// // 1. Inject the listener
// injectClickDispatcher();

// // 2. Later, dispatch custom event with selector
// function triggerClick(selector) {
//   chrome.tabs.executeScript({
//     code: `document.dispatchEvent(new CustomEvent('dispatchClickEvent', { detail: { sel: '${selector}' } }))`
//   });
// }


export const clickPageElement = async (req, res) => {
  try {
    let el = await document.querySelector(req.body.sel), hasClickListener = false
    while (!checkForListeners(el, "click"))
      el = el.parentNode
    // setTimeout(() => {
      const makeMouseEvent = (eStr) => {
        return
        const clickEvent = new MouseEvent(eStr, {
          view: window,
          bubbles: true,
          cancelable: true
        })
      }
      // el.dispatchEvent(makeMouseEvent("mousedown"))
      // el.dispatchEvent(makeMouseEvent("mouseup"))
      el.dispatchEvent(makeMouseEvent("click"))
    // }, 1);
    // const sel = getCssSelector(el)
    // triggerClick(sel)
    res.send(JSON.stringify({ success: true }))
  } catch (error) {
    alert(error)
    res.send(JSON.stringify(error))
  }
}