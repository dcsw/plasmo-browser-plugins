// import type { PlasmoMessaging } from "@plasmohq/messaging"
import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const screenCapture = () => {
  const { data } = useMessage<string, string>(async (req, res) => {
    try {
      const dataUrl = await captureFullPage()
      res.send(dataUrl)
    } catch (error) {
      res.send(error.message)
    }
  })
  return (<div></div>);
}

async function captureFullPage(): Promise<string> {
  const fullHeight = document.body.scrollHeight
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const canvas = document.createElement('canvas')
  canvas.width = viewportWidth
  canvas.height = fullHeight
  const ctx = canvas.getContext('2d')

  let yOffset = 0
  while (yOffset < fullHeight) {
    window.scrollTo(0, yOffset)

    // Wait for any lazy-loaded content and reflows
    await new Promise(resolve => setTimeout(resolve, 100))

    const dataUrl = await captureVisiblePart()
    const img = await loadImage(dataUrl)

    ctx.drawImage(img, 0, yOffset)

    yOffset += viewportHeight
  }

  // Scroll back to top
  window.scrollTo(0, 0)

  return canvas.toDataURL()
}

async function captureVisiblePart(): Promise<string> {
  // return new Promise((resolve) => {
  //   const canvas = document.createElement('canvas')
  //   canvas.width = window.innerWidth
  //   canvas.height = window.innerHeight
  //   const ctx = canvas.getContext('2d')
  //   ctx.drawImage(document.documentElement, 0, 0)
  //   resolve(canvas.toDataURL())
  // })
  // captureViewport()
  // .then(dataUrl => {
  //   console.log('Viewport captured:', dataUrl);
  //   // You can now use this dataUrl as needed
  // })
  // .catch(error => {
  //   console.error('Error capturing viewport:', error);
  // });
  try {
    const dataUrl = await captureViewport();
    console.log('Viewport captured', dataUrl);
    return dataUrl;
  } catch (e) {
    console.error('Error capturing viewport:', e);
  }
}


function captureViewport(): Promise<string> {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getDisplayMedia({ preferCurrentTab: true })
      .then((stream) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          stream.getTracks().forEach(track => track.stop());
          resolve(canvas.toDataURL('image/png'));
        };
      })
      .catch(error => {
        reject(error);
      });
  });
}


function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export default screenCapture