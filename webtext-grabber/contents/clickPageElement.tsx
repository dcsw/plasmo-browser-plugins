export const clickPageElement = async (req, res) => {
  try {
    const el = document.querySelector(req.body.sel)
    await el.click()
    res.send(JSON.stringify({ success: true }))
  } catch (error) {
    res.send(JSON.stringify(error))
  }
}