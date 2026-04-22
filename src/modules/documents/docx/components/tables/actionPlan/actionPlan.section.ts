import { DocumentDataEntity } from './../../../../../sst/entities/documentData.entity';
import { DocumentDataPGRDto } from './../../../../../sst/dto/document-data-pgr.dto';
import { PageOrientation, Table, WidthType } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { sectionTitleOnlyHeadersFooters } from '../../../base/layouts/annex/sectionTitleOnlyHeadersFooters';
import { IHierarchyMap } from '../../../converter/hierarchy.converter';
import { actionPlanHeader, actionPlanSectionTitle } from './actionPlan.constant';
import { actionPlanConverter } from './actionPlan.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';

/** Cabeçalho/rodapé exclusivos do anexo Plano de Ação: só o título no header; rodapé vazio (sem logo/página/versão). */
export const actionPlanAnnexSectionHeadersFooters = () => sectionTitleOnlyHeadersFooters(actionPlanSectionTitle);

export const actionPlanTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto,
  hierarchyTree: IHierarchyMap,
) => {
  const actionPlanData = actionPlanConverter(riskFactorGroupData, hierarchyTree);

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
  };

  return section;
};
