import html2canvas from './html2canvas.min';
import * as htmlToImage from 'html-to-image';

const captureFullPage = async (selector: string) => {
  const element: HTMLNode = document.querySelector(selector);
  if (element) {
    try {
      const fontEmbedCSS = await htmlToImage.getFontEmbedCSS(element);
      const imageURL = await htmlToImage.toPng(element, {
        // useCORS: true,
        backgroundColor: "#FFFFFF", // Prevents transparent background
        height: element.scrollHeight,
        cacheBust: true,
        includeQueryParams: true,
        fontEmbedCSS,
        skipAutoScale: true
      })
      return imageURL
    } catch (err) {
      try {
        const canvas = await html2canvas(element, {
          // windowWidth: window.outerWidth,
          // windowHeight: window.outerHeight,
          // scale: 1,
          allowTaint: true,
          logging: false,
          useCORS: true,
          imageTimeout: 30000,
          foreignObjectRendering: true,
          scale: 1,
          onclone: (clonedDoc: any) => {
            const svgElements = clonedDoc.querySelectorAll('svg');
            svgElements.forEach((svg) => {
              const bbox = svg.getBoundingClientRect();
              svg.setAttribute('width', bbox.width);
              svg.setAttribute('height', bbox.height);
            });
          }
        })
        // Now use canvas
        const imageURL = await canvas.toDataURL('image/png');
        return imageURL;
      } catch (err) {
        alert('oops, something went wrong!' + err.message);
        throw err
      }
    }
  }
  return null;
}

export const screenCapture = async (req, res) => {
  try {
    // const dataUrl = await captureFullPage(req.body.selector)
    const dataUrl = await captureIncremental(req.body.selector)
    if (!dataUrl.match(/^data\:/)) throw new Error("Error: " + dataUrl);
    res.send(JSON.stringify({ url: document.location.href, title: document.title, screenshotUrl: dataUrl }))
  } catch (error) {
    res.send(JSON.stringify(error))
  }
}


// Configuration
const STEP_SCROLL = 100; // Adjust this value to control how much you scroll per step (in pixels)
let lastScrollTop = 0;

/**
 * Capture a portion of the page, moving the scroll position incrementally.
 *
 * @param selector The CSS selector for the element to capture.
 */
async function captureIncremental(selector: string) {
  const element = document.querySelector(selector);
  
  if (!element) {
    throw new Error('Element not found.');
  }

  // Function to actually capture and stitch together multiple pages
  async function captureAndStitch(): Promise<string[]> {
    const screenshots: string[] = [];

    let scrollTop = element.scrollTop;
    while (scrollTop < element.scrollHeight - element.clientHeight) {
      // Save the current scroll position before adjusting
      lastScrollTop = scrollTop;

      // Capture the current visible portion
      try {
        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          logging: false,
          imageTimeout: 30000,
          foreignObjectRendering: true,
          scrollY: -scrollTop // Adjust scroll position here
        });

        // Convert the canvas to a data URL
        const dataURL = await canvas.toDataURL('image/png');

        screenshots.push(dataURL);

        // Scroll to the next portion
        scrollTop += STEP_SCROLL;
        element.scrollTop = scrollTop; // Update scroll position
      } catch (err) {
        console.error('Error capturing page:', err);
        break; // Exit loop if any error encountered
      }
    }

    return screenshots;
  }

  try {
    const screenshots = await captureAndStitch();
    return screenshots;
  } catch (error) {
    throw error;
  }
}

/**
 * Resets scroll position to the last known good state.
 */
function resetScrollPosition() {
  element.scrollTop = lastScrollTop; // Reset scroll position
}

export const screenCaptureIncremental = async (req, res) => {
  try {
    const screenshotsDataUrls = await captureIncremental(req.body.selector);
    
    if (!screenshotsDataUrls || screenshotsDataUrls.length === 0) {
      throw new Error("No screenshots captured.");
    }

    // Create a composite image from the individual screenshots
    // This is a simple approach, you might need to handle alignment and stitching better based on your needs
    const compositeImage = await htmlToImage.toCanvas(document.body, { background: '#fff' });

    // Export as data URL for easy transmission over HTTP
    const compositeDataURL = await compositeImage.toDataURL('image/png');

    res.send(JSON.stringify({ url: document.location.href, title: document.title, screenshotUrls: screenshotsDataUrls, compositeScreenshotUrl: compositeDataURL }));

  } catch (error) {
    res.send(JSON.stringify(error));
  }
}