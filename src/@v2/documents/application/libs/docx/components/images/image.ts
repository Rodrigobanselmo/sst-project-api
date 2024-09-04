import { ImageRun, Paragraph } from 'docx';
import sizeOf from 'image-size';
import fs from 'fs';
import { IImage } from '../../../../../domain/types/elements.types';
import { setNiceProportion } from '../../helpers/set-nice-proportion';
import { IImagesMap } from '@/@v2/documents/application/factories/document/types/document-factory.types';

export const imageDoc = (data: IImage, imagesMap?: IImagesMap) => {
  const path = imagesMap?.[data.url]?.path || 'images/hierarchy-risk-pgr.png';
  const file = fs.readFileSync(path);
  const pageWidth = 717.6;
  const pageHeight = 975.2;

  const imageWidth = (pageWidth * (data.width || 100)) / 100;

  const { height: imgHeight, width: imgWidth } = sizeOf(file);
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
