import {
  AlignmentType,
  ISectionOptions,
  Paragraph,
  TableOfContents,
  TextRun,
} from 'docx';

import { sectionCoverProperties } from '../../config/styles';

const summaryText = (text: string) =>
  new Paragraph({
    children: [
      new TextRun({
        text: text,
        size: 24,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400, before: 0 },
  });

export const summarySections = (): ISectionOptions[] => [
  {
    children: [
      summaryText('Sumário'),
      new TableOfContents('Summary', {
        hyperlink: true,
      }),
    ],

    properties: sectionCoverProperties,
  },
  {
    children: [
      summaryText('Índice de tabelas'),
      new TableOfContents('Tables', {
        hyperlink: true,
        captionLabelIncludingNumbers: 'Table',
      }),
    ],
    properties: sectionCoverProperties,
  },
  {
    children: [
      summaryText('Índice de imagens'),
      new TableOfContents('Tables', {
        hyperlink: true,
        captionLabelIncludingNumbers: 'Table',
      }),
    ],
    properties: sectionCoverProperties,
  },
];

// {
//       children: [
//         new Paragraph({
//           text: 'Header #1',
//           heading: HeadingLevel.HEADING_1,
//           pageBreakBefore: true,
//         }),
//         new Paragraph({
//           text: 'PLZZZ',
//           pageBreakBefore: true,
//           children: [new SequentialIdentifier('Label')],
//         }),
//       ],
//     },
