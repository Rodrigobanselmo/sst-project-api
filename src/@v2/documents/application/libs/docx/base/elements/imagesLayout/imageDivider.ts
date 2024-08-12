import { Paragraph } from 'docx';

export const ImageDivider = () =>
  new Paragraph({
    text: '',
    spacing: { after: 0, before: 0, line: 0 },
  });
