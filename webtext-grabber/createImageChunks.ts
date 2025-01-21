import { Jimp, JimpMime, ScaleToFitOptions } from 'jimp/dist/browser';
import { Paragraph, ImageRun, AlignmentType } from 'docx';

export async function createImageChunks(
    imageBuffer: Buffer,
    pageWidth: number,
    pageHeight: number,
    initialPageHeight: number,
    alignment : AlignmentType = AlignmentType.LEFT
): Promise<ImageRun[]> {
    const rawImage = await Jimp.read(imageBuffer);
    const targetImageWidth = Math.min(rawImage.bitmap.width, pageWidth)
    const image = await rawImage.scaleToFit({ w: ~~targetImageWidth, h: ~~(rawImage.bitmap.height * pageWidth/rawImage.bitmap.width) })
    const chunks: ImageRun[] = [];

    const chunkHeight = Math.min(pageHeight, image.bitmap.height);

    for (let y = 0; y < image.bitmap.height; y += chunkHeight) {
        // Ensure we do not exceed image dimensions
        const widthToCrop = Math.min(pageWidth, image.bitmap.width)
        const heightToCrop = Math.min(chunkHeight, image.bitmap.height - y);

        // Ensure valid cropping parameters
        if (heightToCrop > 0) {
            // console.log(`Cropping at (0, ${y}) with width ${image.bitmap.width} and height ${heightToCrop}`);

            const chunk = image.clone().crop({ x: 0, y: y, w: image.bitmap.width, h: heightToCrop });
            const buffer = await chunk.getBuffer(JimpMime.jpeg);
            chunks.push(
                new Paragraph({
                    alignment: alignment,
                    children: [
                        new ImageRun({
                            data: buffer,
                            transformation: {
                                width: widthToCrop,
                                height: heightToCrop,
                            },
                        })]
                }));
        }
    }

    return chunks;
}
