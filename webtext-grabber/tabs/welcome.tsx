import React from 'react';
import { usePort } from "@plasmohq/messaging/hook";
const pkg = require("../package.json")
const { displayName: name, version, author, dependencies, description } = pkg;

type RequestBody = {
  hello: string
}

type ResponseBody = {
  message: string
}

function WelcomeTab() {
  const mailPort = usePort<RequestBody, ResponseBody>("mail")

  return
  <div>
    {/* {mailPort.data?.message}
      <button
        onClick={async () => {
          mailPort.send({
            hello: "world"
          })
        }}>
        Send Port
      </button> */}
    <h1>Welcome to {name}!</h1>
    <div>This is {name} version {version} {description[0].toLowerCase()}{description.match(/.(.*)\.?$/)[1]} written by {author}.</div>
    <details>
      <summary>Dependencies</summary>
      {/* {Object.entries(dependencies).map(([n, v], _i) => (<div>{n}@{v}</div>)).join('')} */}
      dogs
    </details>
  </div>
}

export default WelcomeTab
