import { ImageRun, ISectionOptions, Paragraph, TextRun } from 'docx';
import fs from 'fs';

import { sectionCoverProperties } from '../../config/styles';

interface IHeaderProps {
  version: string;
  imgPath: string;
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

const versionDate = (version: string) =>
  new Paragraph({
    children: [
      new TextRun({
        text: version,
        size: 40,
      }),
    ],
    spacing: { after: 100, before: 0 },
  });

const imageCover = (imgPath: string) =>
  new Paragraph({
    children: [
      new ImageRun({
        data: fs.readFileSync(imgPath),
        transformation: {
          width: 600,
          height: 337,
        },
      }),
    ],
  });

export const createCover = ({
  version,
  imgPath,
}: IHeaderProps): Paragraph[] => {
  return [title(), versionDate(version), imageCover(imgPath)];
};

export const coverSections = ({
  version,
  imgPath,
}: IHeaderProps): ISectionOptions => {
  return {
    children: [...createCover({ version, imgPath })],
    properties: sectionCoverProperties,
  };
};
