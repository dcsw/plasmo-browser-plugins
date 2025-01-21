import { Document, Packer, Paragraph, TextRun, ExternalHyperlink, HeadingLevel, AlignmentType, convertInchesToTwip, PageSize } from 'docx';
import { createImageChunks } from "./createImageChunks"

export const makeDoc = async (sel: string) => {
  let o = {
    sections: []
  }

  const items = Array.from(document.querySelectorAll(sel + ' > .item'))
  const linkUrls = items.map(i => i.querySelector('a').href)
  const linkTexts = items.map(i => i.querySelector('a').textContent)
  const screenShotImgUrls = items.map(i => i.querySelector('img').src)
  const heights = items.map(i => i.querySelector('img').clientHeight)
  const widths = items.map(i => i.querySelector('img').clientWidth)

  const level = HeadingLevel.HEADING_2
  const alignment = AlignmentType.LEFT

  const myPageSize = { width: 8.5, height: 11 }
  const myMarginSizes = { top: 1, right: 1, bottom: 1, left: 1 }
  const firstImageChunkHeight = 5
  const pageSizeTWIPs = {
    width: convertInchesToTwip(myPageSize.width),
    height: convertInchesToTwip(myPageSize.height)
  }
  const marginSizesTWIPs = {
    top: convertInchesToTwip(myMarginSizes.top),
    right: convertInchesToTwip(myMarginSizes.right),
    bottom: convertInchesToTwip(myMarginSizes.bottom),
    left: convertInchesToTwip(myMarginSizes.left)
  }

  o.sections.push({
    properties: {
      page: {
        size: pageSizeTWIPs,
        margin: marginSizesTWIPs
      }
    },
    children: []
  })

  const myConvertInches2TWIPs = (i) => i * 1044 / 10 // these TWIPs are 10ths of Imperial Points, which are 1044 PPI in a docx doc...apparently
  const availableWidth = myPageSize.width - myMarginSizes.left - myMarginSizes.right
  const w = myConvertInches2TWIPs(availableWidth)
  const availablePageHeight = myPageSize.height - myMarginSizes.top - myMarginSizes.bottom
  const h = myConvertInches2TWIPs(availablePageHeight)
  for (let i = 0; i < items.length; i++) {
    o.sections[0].children.push(
      new Paragraph({
        heading: level,
        alignment: alignment,
        children: [
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: linkTexts[i],
                break: 0
              })
            ],
            link: linkUrls[i]
          })]
      }))

    const imgChunks = await createImageChunks(Buffer.from(screenShotImgUrls[i].split(',')[1], 'base64'), w, h, myConvertInches2TWIPs(firstImageChunkHeight), alignment)
    o.sections[0].children.push(...imgChunks)
  }
  const doc = new Document(o)
  return await Packer.toBuffer(doc)
}