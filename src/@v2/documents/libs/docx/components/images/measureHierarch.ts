import { ImageRun, Paragraph } from 'docx';
import fs from 'fs';

export const measureHierarchyImage = () => {
  const images = new Paragraph({
    children: [
      new ImageRun({
        data: fs.readFileSync('images/hierarchy-risk-pgr.png'),
        transformation: {
          width: 600,
          height: 350,
        },
      } as any),
    ],
    spacing: { after: 100 },
  });

  return [images];
};

//quantityResultsFBVTable
