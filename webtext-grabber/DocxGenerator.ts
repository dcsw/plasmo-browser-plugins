import {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, ImageRun, HeadingLevel, BorderStyle, AlignmentType,
  sectionMarginDefaults, sectionPageSizeDefaults, PageSize, convertInchesToTwip
} from 'docx';

export const makeDoc = async (sel: string) => {
  let o = {
    sections: []
  }

  const items = Array.from(document.querySelectorAll(sel + ' > .item'))
  const titles = items.map(i => i.querySelector('summary').textContent)
  const linkUrls = items.map(i => i.querySelector('a').href)
  const linkTexts = items.map(i => i.querySelector('a').textContent)
  const screenShotImgUrls = items.map(i => i.querySelector('img').src)
  const heights = items.map(i => i.querySelector('img').clientHeight)
  const widths = items.map(i => i.querySelector('img').clientWidth)

  // const level: HeadingLevel = HeadingLevel.HEADING_1
  const level = HeadingLevel.HEADING_2
  // const alignment: AlignmentType = AlignmentType.LEFT
  const alignment = AlignmentType.LEFT

  // Calculate available width (in twips)
  // const pageWidth = convertInchesToTwip(sectionPageSizeDefaults.WIDTH);
  // const pageWidth = sectionPageSizeDefaults.WIDTH;
  // const margins = convertInchesToTwip(2); // 1-inch margins on each side
  // const availableWidth = pageWidth - margins;
  // const availableWidth = sectionPageSizeDefaults.WIDTH - sectionMarginDefaults.LEFT - sectionMarginDefaults.RIGHT

  const myPageSize = {
    width: convertInchesToTwip(8.5),
    height: convertInchesToTwip(11),
  }
  const myMarginSizes = {
    top: convertInchesToTwip(1),
    right: convertInchesToTwip(1),
    bottom: convertInchesToTwip(1),
    left: convertInchesToTwip(1),
  }
  const availableWidth = myPageSize.width - myMarginSizes.left - myMarginSizes.right
  o.sections.push({
    properties: {
      page: {
        size: myPageSize,
        margin: myMarginSizes,
      },
    },
    children: []
  })
  for (let i = 0; i < items.length; i++) {
    o.sections[0].children.push(
      new Paragraph({
        text: titles[i],
        heading: level
      }))
    o.sections[0].children.push(
      new Paragraph({
        alignment: alignment,
        children: [
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: linkTexts[i],
                style: "Hyperlink"
              })
            ],
            link: linkUrls[i]
          }),
          new ImageRun({
            data: Buffer.from(screenShotImgUrls[i].split(',')[1], 'base64'),
            transformation: {
              // width: availableWidth, // widths[i],
              // height: availableWidth * heights[i] / widths[i] // preserve aspect ratio
              width: widths[i],
              height: heights[i]
            }
          })]
      }))
  }
  const doc = new Document(o)
  return await Packer.toBuffer(doc)
}