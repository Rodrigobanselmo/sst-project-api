import { pageHeight } from './../../base/config/styles';
import { setNiceProportion } from './../../../../../shared/utils/setNiceProportion';
import { IImagesMap } from './../../../factories/document/types/IDocumentFactory.types';
import { ImageRun, Paragraph } from 'docx';
import sizeOf from 'image-size';
import fs from 'fs';
import { IImage } from '../../builders/pgr/types/elements.types';

export const imageDoc = (data: IImage, imagesMap?: IImagesMap) => {
  const path = imagesMap?.[data.url]?.path || 'images/hierarchy-risk-pgr.png';
  const file = fs.readFileSync(path)
  const pageWidth = 717.6;
  const pageHeight = 975.2;

  const imageWidth = (pageWidth * (data.width || 100)) / 100;

  const { height: imgHeight, width: imgWidth } = sizeOf(file);
  const { height, width } = setNiceProportion(imageWidth, pageHeight / 2, imgWidth, imgHeight);

  const images = new Paragraph({
    children: [
      new ImageRun({
        data: file,
        transformation: {
          width,
          height,
          //maxWidth:717.6
          //maxHeight:975.2
        },
      }),
    ],
    spacing: { after: 100 },
  });

  return [images];
};
