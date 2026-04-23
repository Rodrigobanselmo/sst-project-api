import { AlignmentType, Footer, ISectionOptions, PageOrientation, Paragraph, Table, TextRun, WidthType } from 'docx';

import { sectionTitleOnlyHeadersFooters } from '../../../base/layouts/annex/sectionTitleOnlyHeadersFooters';
import { IDocumentRiskGroupDataConverter, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { actionPlanHeader, actionPlanSectionTitle } from './actionPlan.constant';
import { actionPlanConverter } from './actionPlan.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { palette } from '../../../constants/palette';

export const actionPlanAnnexSectionHeadersFooters = () => {
  const sectionLayout = sectionTitleOnlyHeadersFooters(actionPlanSectionTitle);

  const createStatusLegendParagraph = () =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
      children: [
        new TextRun({ text: '●', color: '7A7A7A', size: 16 }),
        new TextRun({ text: ' Pendente ', color: palette.text.main.string, size: 16 }),
        new TextRun({ text: '|', color: palette.text.main.string, size: 16 }),
        new TextRun({ text: ' ●', color: palette.text.simple.string, size: 16 }),
        new TextRun({ text: ' Iniciado ', color: palette.text.main.string, size: 16 }),
        new TextRun({ text: '|', color: palette.text.main.string, size: 16 }),
        new TextRun({ text: ' ●', color: palette.table.attention.string, size: 16 }),
        new TextRun({ text: ' Concluído ', color: palette.text.main.string, size: 16 }),
        new TextRun({ text: '|', color: palette.text.main.string, size: 16 }),
        new TextRun({ text: ' ●', color: palette.text.attention.string, size: 16 }),
        new TextRun({ text: ' Cancelado', color: palette.text.main.string, size: 16 }),
      ],
    });

  return {
    ...sectionLayout,
    footers: {
      default: new Footer({ children: [createStatusLegendParagraph()] }),
      first: new Footer({ children: [createStatusLegendParagraph()] }),
    },
  };
};

export const actionPlanTableSection = (document: IDocumentRiskGroupDataConverter, hierarchyTree: IHierarchyMap) => {
  const actionPlanData = actionPlanConverter(document.riskGroupData, document.documentVersion, hierarchyTree);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(actionPlanHeader.map(tableHeaderElements.headerCell)),
      ...actionPlanData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  const section = {
    children: [table],
    properties: {
      page: {
        margin: { left: 500, right: 500, top: 500, bottom: 500 },
        size: { orientation: PageOrientation.LANDSCAPE },
      },
    },
  } satisfies ISectionOptions;

  return section;
};
