// @ts-nocheck
globalThis.__plasmoInternalPortMap = new Map()

import { default as messagesGetManifest } from "~background/messages/get-manifest"
import { default as messagesHashTx } from "~background/messages/hash-tx"
import { default as messagesOpenExtension } from "~background/messages/open-extension"
import { default as messagesMathAdd } from "~background/messages/math/add"
import { default as portsMail } from "~background/ports/mail"

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  switch (request.name) {
    case "get-manifest":
  messagesGetManifest({
    sender,
    ...request
  }, {
    send: (p) => sendResponse(p)
  })
  break
case "hash-tx":
  messagesHashTx({
    sender,
    ...request
  }, {
    send: (p) => sendResponse(p)
  })
  break
case "open-extension":
  messagesOpenExtension({
    sender,
    ...request
  }, {
    send: (p) => sendResponse(p)
  })
  break
case "math/add":
  messagesMathAdd({
    sender,
    ...request
  }, {
    send: (p) => sendResponse(p)
  })
  break
    default:
      break
  }

  return true
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.name) {
    case "get-manifest":
  messagesGetManifest({
    sender,
    ...request
  }, {
    send: (p) => sendResponse(p)
  })
  break
case "hash-tx":
  messagesHashTx({
    sender,
    ...request
  }, {
    send: (p) => sendResponse(p)
  })
  break
case "open-extension":
  messagesOpenExtension({
    sender,
    ...request
  }, {
    send: (p) => sendResponse(p)
  })
  break
case "math/add":
  messagesMathAdd({
    sender,
    ...request
  }, {
    send: (p) => sendResponse(p)
  })
  break
    default:
      break
  }

  return true
})

chrome.runtime.onConnect.addListener(function(port) {
  globalThis.__plasmoInternalPortMap.set(port.name, port)
  port.onMessage.addListener(function(request) {
    switch (port.name) {
      case "mail":
  portsMail({
    port,
    ...request
  }, {
    send: (p) => port.postMessage(p)
  })
  break
      default:
        break
    }
  })
})

