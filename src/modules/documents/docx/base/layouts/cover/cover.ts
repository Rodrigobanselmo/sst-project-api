import { setNiceProportion } from './../../../../../../shared/utils/setNiceProportion';
import sizeOf from 'image-size';
import {
  AlignmentType,
  ImageRun,
  ISectionOptions,
  Paragraph,
  TextRun,
} from 'docx';
import fs from 'fs';

import { sectionCoverProperties } from '../../config/styles';

interface IHeaderProps {
  version: string;
  imgPath: string;
  companyName: string;
}

const title = () =>
  new Paragraph({
    children: [
      new TextRun({
        text: 'PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR',
        size: 96,
        bold: true,
      }),
    ],
    spacing: { after: 400, before: 0 },
  });

const textShow = (version: string) =>
  new Paragraph({
    children: [
      new TextRun({
        text: version,
        size: 40,
      }),
    ],
    spacing: { after: 100, before: 0 },
  });

const imageCover = (imgPath: string) => {
  const { height: imgHeight, width: imgWidth } = sizeOf(
    fs.readFileSync(imgPath),
  );

  const maxWidth = 630;
  const maxHeight = 354;

  const { height, width } = setNiceProportion(
    maxWidth,
    maxHeight,
    imgWidth,
    imgHeight,
  );

  return new Paragraph({
    children: [
      new ImageRun({
        data: fs.readFileSync(imgPath),
        transformation: {
          width,
          height,
        },
      }),
    ],
    alignment: AlignmentType.CENTER,
  });
};

export const createCover = ({
  version,
  imgPath,
  companyName,
}: IHeaderProps): Paragraph[] => {
  if (!imgPath) return [title()];
  return [
    title(),
    textShow(version),
    textShow(''),
    imageCover(imgPath),
    textShow(''),
    textShow(''),
    textShow(companyName),
  ];
};

export const coverSections = ({
  version,
  imgPath,
  companyName,
}: IHeaderProps): ISectionOptions => {
  return {
    children: [...createCover({ version, imgPath, companyName })],
    properties: sectionCoverProperties,
  };
};
