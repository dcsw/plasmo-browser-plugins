export const checkPageElement = async (req, res) => {
  try {
    const exists = document.querySelector(req.body.sel) ? true : false
    res.send(JSON.stringify({ exists: exists }))
  } catch (error) {
    res.send(JSON.stringify(error))
  }
}