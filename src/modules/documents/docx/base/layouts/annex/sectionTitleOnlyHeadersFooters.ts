import { AlignmentType, Footer, Header, Paragraph, TextRun } from 'docx';

import { palette } from '../../../../../../shared/constants/palette';

/** Cabeçalho só com título centralizado e rodapé vazio (anexos PGR enxutos). */
export const sectionTitleOnlyHeadersFooters = (titleLine: string) => ({
  headers: {
    default: new Header({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40, before: 0 },
          children: [
            new TextRun({
              text: titleLine,
              bold: true,
              size: 20,
              color: palette.text.main.string,
            }),
          ],
        }),
      ],
    }),
    first: new Header({ children: [] }),
  },
  footers: {
    default: new Footer({ children: [] }),
  },
});
