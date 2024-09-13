import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import html2canvas from 'html2canvas';

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const screenCapture = () => {
  const { data } = useMessage<string, string>(async (req, res) => {
    try {
      const dataUrl = await captureFullPage(req.selector)
      res.send(dataUrl)
    } catch (error) {
      res.send(error.message)
    }
  })
  return true;
}

async function captureFullPage(selector: string): Promise<string> {
  const element: HTMLElement = document.querySelector(selector);
  if (element) {
    const canvas :HTMLCanvasElement = await html2canvas(element)
      const image = await canvas.toDataURL('image/png');
      return image;
  }
  return null;
}


async function captureFullPagexxx(): Promise<string> {
  const fullHeight = document.body.scrollHeight
  const fullWidth = document.body.scrollWidth
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const canvas = document.createElement('canvas')
  canvas.width = fullWidth
  canvas.height = fullHeight
  const ctx = canvas.getContext('2d')

  let xOffset = 0, yOffset
  while (xOffset < fullWidth) {
    yOffset = 0
    while (yOffset < fullHeight) {
      window.scrollTo(xOffset, yOffset)

      // Wait for any lazy-loaded content and reflows
      await new Promise(resolve => setTimeout(resolve, 100))

      const dataUrl = await captureVisiblePart()
      const img = await loadImage(dataUrl)

      ctx.drawImage(img, xOffset, yOffset)

      yOffset += viewportHeight
    }
    xOffset += viewportWidth
  }

  // Scroll back to top
  window.scrollTo(0, 0)

  return canvas.toDataURL()
}

async function captureVisiblePart(): Promise<string> {
  try {
    const dataUrl = await captureViewport();
    // console.log('Viewport captured', dataUrl);
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