import { AlignmentType, Footer, Header, Paragraph, TextRun } from 'docx';

import { palette } from '../../../constants/palette';

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
            } as any),
          ],
        } as any),
      ],
    } as any),
    first: new Header({ children: [] } as any),
  },
  footers: {
    default: new Footer({ children: [] } as any),
  },
});
