import { ImageRun, Paragraph } from 'docx';
import fs from 'fs';

export const rsDocumentImage = () => {
  const images = new Paragraph({
    children: [
      new ImageRun({
        data: fs.readFileSync('images/rs-document.png'),
        transformation: {
          width: 700,
          height: 350,
        },
      }),
    ],
    spacing: { after: 100 },
  });

  return [images];
};