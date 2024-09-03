import type { PlasmoCSConfig } from "plasmo"

import { useMessage } from "@plasmohq/messaging/hook"

export const config: PlasmoCSConfig = {
  all_frames: true
}

const QueryTextAnywhere = () => {
  const { data } = useMessage<string, string>(async (req, res) => {
    console.log(req.body)
    res.send(document.querySelector(req.body).innerHTML)
  })
//   return (
//     <div
//       style={{
//         padding: 8,
//         background: "#333",
//         color: "red"
//       }}>
//       Querying Selector for: {data}
//     </div>
//   )
  return (<div></div>)
}

export default QueryTextAnywhere
