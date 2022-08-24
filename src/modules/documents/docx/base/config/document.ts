import { Document, ISectionOptions, LevelFormat } from 'docx';

export const createBaseDocument = (sections: ISectionOptions[]) => {
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'heading-numbering',
          levels: [
            {
              level: 0,
              text: '%1.',
              format: LevelFormat.DECIMAL,
            },
            {
              level: 1,
              text: '%1.%2.',
              format: LevelFormat.DECIMAL,
            },
            {
              level: 2,
              text: '%1.%2.%3.',
              format: LevelFormat.DECIMAL,
            },
            {
              level: 3,
              text: '%1.%2.%3.%4.',
              format: LevelFormat.DECIMAL,
            },
            {
              level: 4,
              text: '%1.%2.%3.%4.%5.',
              format: LevelFormat.DECIMAL,
            },
            {
              level: 5,
              text: '%1.%2.%3.%4.%5.%6.',
              format: LevelFormat.DECIMAL,
            },
          ],
        },
        {
          reference: 'table-numbering',
          levels: [
            {
              level: 0,
              text: 'Tabela: %1',
              format: LevelFormat.DECIMAL,
            },
          ],
        },
      ],
    },
    features: {
      updateFields: true,
    },
    styles: {
      default: {
        title: {
          run: {
            bold: true,
            color: '000000',
            size: 32,
          },
        },
        heading1: {
          run: {
            color: '000000',
            bold: true,
            size: 28,
          },
          paragraph: {
            numbering: {
              reference: 'heading-numbering',
              level: 0,
            },
            spacing: {
              before: 320,
              after: 160,
            },
          },
        },
        heading2: {
          run: {
            color: '000000',
            bold: true,
            size: 26,
          },
          paragraph: {
            numbering: {
              reference: 'heading-numbering',
              level: 1,
            },
            spacing: {
              before: 320,
              after: 160,
            },
          },
        },
        heading3: {
          run: {
            color: '000000',
            bold: true,
            size: 24,
          },
          paragraph: {
            numbering: {
              reference: 'heading-numbering',
              level: 2,
            },
            spacing: {
              before: 320,
              after: 160,
            },
          },
        },
        heading4: {
          run: {
            color: '000000',
            bold: true,
            size: 22,
          },
          paragraph: {
            numbering: {
              reference: 'heading-numbering',
              level: 3,
            },
            spacing: {
              before: 320,
              after: 160,
            },
          },
        },
        heading5: {
          run: {
            color: '000000',
            bold: true,
            size: 20,
          },
          paragraph: {
            numbering: {
              reference: 'heading-numbering',
              level: 4,
            },
            spacing: {
              before: 320,
              after: 160,
            },
          },
        },
        heading6: {
          run: {
            color: '000000',
            bold: true,
            size: 20,
          },
          paragraph: {
            numbering: {
              reference: 'heading-numbering',
              level: 5,
            },
            spacing: {
              before: 320,
              after: 160,
            },
          },
        },
        document: {
          run: {
            font: 'Century Gothic',
            size: 20,
          },
          paragraph: {
            spacing: {
              before: 0,
              after: 160,
            },
          },
        },
      },
      paragraphStyles: [
        // {
        //   id: 'MySpectacularStyle',
        //   name: 'My Spectacular Style',
        //   basedOn: 'Heading1',
        //   next: 'Heading1',
        //   quickFormat: true,
        //   run: {
        //     italics: true,
        //     color: '990000',
        //   },
        // },
      ],
    },
    sections: sections,
  });

  return doc;
};
