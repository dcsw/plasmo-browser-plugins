// import { checkForListeners } from './eventsTracker' // apparently not needed

export const clickPageElement = async (req, res) => {
  try {
    let el = await document.querySelector(req.body.sel), hasClickListener = false
    // while (!checkForListeners(el, "click") && el.parentNode) // apparently not needed
    //   el = el.parentNode
    const makeMouseEvent = (eStr) => {
      return new MouseEvent(eStr, {
        view: window,
        bubbles: true,
        cancelable: true
      })
    }
    el.dispatchEvent(makeMouseEvent("click"))
    res.send(JSON.stringify({ success: true }))
  } catch (error) {
    console.error(error)
    res.send(JSON.stringify(error))
  }
}