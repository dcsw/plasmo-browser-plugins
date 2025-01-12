import { Document, Packer, Paragraph, TextRun, ExternalHyperlink, ImageRun, HeadingLevel, BorderStyle, AlignmentType } from 'docx';

export const makeDoc = async (sel: string) => {
  const o = {
    sections: [{
      properties: {},
      children: []
    }]
  }

  const items = Array.from(document.querySelectorAll(sel + ' > .item'))
  const titles = items.map(i => i.querySelector('summary').textContent)
  const linkUrls = items.map(i => i.querySelector('a').href)
  const linkTexts = items.map(i => i.querySelector('a').textContent)
  const screenShotImgUrls = items.map(i => i.querySelector('img').src)

  // const level: HeadingLevel = HeadingLevel.HEADING_1
  const level = HeadingLevel.HEADING_1
  // const alignment: AlignmentType = AlignmentType.LEFT
  const alignment = AlignmentType.LEFT

  for (let i = 0; i < items.length; i++) {
    o.sections.push({
      properties: {},
      children: [
        new Paragraph({
          text: titles[i],
          heading: level
        }),
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
            // new ImageRun({
            //   data: Buffer.from(screenShotImgUrls[i].split(',')[1], 'base64'),
            //   // transformation: {
            //   //   width: 200,
            //   //   height: 200,
            //   // },
            // })
          ]
        }),
        new Paragraph("No border!"),
        new Paragraph({
          text: "I have borders on my top and bottom sides!",
          border: {
            top: {
              color: "auto",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
            bottom: {
              color: "auto",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),
        new Paragraph({
          text: "",
          border: {
            top: {
              color: "auto",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "This will ",
            }),
            new TextRun({
              text: "have a border.",
              border: {
                color: "auto",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            }),
            new TextRun({
              text: " This will not.",
            }),
          ],
        }),
      ]
    })
    const doc = await new Document(o)
    return await Packer.toBuffer(doc)
  }
}