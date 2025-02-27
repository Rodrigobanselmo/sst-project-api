import { ImageRun, Paragraph } from 'docx';
import fs from 'fs';
import sizeOf from 'image-size';
import { IImage } from '../../../../domain/types/elements.types';
import { setNiceProportion } from '../../helpers/set-nice-proportion';

export const imageDoc = (data: IImage) => {
  const path = data.path || 'images/hierarchy-risk-pgr.png';
  const file = fs.readFileSync(path);
  const pageWidth = 717.6;
  const pageHeight = 975.2;

  const imageWidth = (pageWidth * (data.width || 100)) / 100;

  const { height: imgHeight, width: imgWidth } = sizeOf(file as any);
  const { height, width } = setNiceProportion(imageWidth, pageHeight / 2, imgWidth || 0, imgHeight || 0);

  const images = new Paragraph({
    children: [
      new ImageRun({
        data: file,
        transformation: {
          width,
          height,
        },
      }),
    ],
    spacing: { after: 100 },
  });

  return [images];
};
