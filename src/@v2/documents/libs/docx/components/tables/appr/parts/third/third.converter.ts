import { RiskFactorsEnum } from '@prisma/client';
import { AlignmentType } from 'docx';
import { palette } from '../../../../../constants/palette';
import { HierarchyMapData, IDocumentRiskGroupDataConverter, IGHODataConverter } from '../../../../../converter/hierarchy.converter';

import { RiskDataModel } from '@/@v2/documents/domain/models/risk-data.model';
import { shouldHideRecommendationInPgr } from '@/modules/documents/docx/utils/pgr-recommendation-document-visibility';
import { getRiskTypeDisplayLabel } from '@/modules/documents/docx/utils/risk-type-display-label.util';
import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { sortNumber } from '@/@v2/shared/utils/sorts/number.sort';
import { sortString } from '@/@v2/shared/utils/sorts/string.sort';
import { matrixRiskMap } from '../../../../../constants/matriz-risk-map';
import { originRiskMap } from '../../../../../constants/origin-risk';
import { riskMap } from '../../../../../constants/risks-map';
import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { whiteBorder, whiteColumnBorder } from '../../elements/header';
import { ThirdRiskInventoryColumnEnum } from './third.constant';
import {
  thirdRiskInventoryColumnWidth,
  thirdRiskInventoryVerticalColumns,
} from '@/modules/documents/docx/components/tables/appr/parts/third/third.constant';

export function isRiskValidForHierarchyData({
  hierarchyData,
  riskData,
  isByGroup,
  homogeneousGroup,
}: {
  hierarchyData: HierarchyMapData;
  homogeneousGroup: IGHODataConverter;
  riskData: RiskDataModel;
  isByGroup: boolean;
}) {
  if (!hierarchyData.allHomogeneousGroupIds.includes(homogeneousGroup.gho.id)) return false;

  if (!isByGroup) {
    const foundHierarchy = riskData.risk.documentsRequirements.find((doc) => !!hierarchyData.org.find((hierarchy) => hierarchy.id === doc.hierarchyId));
    if (foundHierarchy && foundHierarchy.isPGR === false) return false;
  }

  return true;
}

export const dataConverter = (
  riskGroup: IDocumentRiskGroupDataConverter,
  hierarchyData: HierarchyMapData,
  isByGroup: boolean,
  options: {
    isHideCA: boolean;
    isHideOrigin: boolean;
  },
) => {
  const riskFactorsMap = new Map<RiskFactorsEnum, bodyTableProps[][]>();
  const riskInventoryData: bodyTableProps[][] = [];

  riskGroup.riskGroupData
    .sort((a, b) => sortString(a.riskData.risk.name, b.riskData.risk.name))
    .sort((a, b) => sortNumber(riskMap[a.riskData.risk.type]?.order, riskMap[b.riskData.risk.type]?.order))
    .forEach(({ riskData, homogeneousGroup }) => {
      if (!isRiskValidForHierarchyData({ hierarchyData, homogeneousGroup, riskData, isByGroup })) return;

      const cells: bodyTableProps[] = [];

      const base = {
        borders: {
          ...borderNoneStyle,
          right: whiteColumnBorder,
          top: whiteColumnBorder,
        },
        margins: { top: 50, bottom: 50 },
        alignment: AlignmentType.CENTER,
      };
      const attention = { color: palette.text.attention.string, bold: true };
      const fill = { shading: { fill: palette.table.header.string } };

      const riskOccupational = matrixRiskMap[getMatrizRisk(riskData.risk.severity, riskData.probability)];
      const riskOccupationalAfter = matrixRiskMap[getMatrizRisk(riskData.risk.severity, riskData.probabilityAfter)];

      let origin: string = '';

      if (homogeneousGroup.gho.isEnviroment && homogeneousGroup.gho.characterization)
        origin = `${homogeneousGroup.gho.characterization.name}\n(${originRiskMap[homogeneousGroup.gho.characterization.type].name})`;

      if (homogeneousGroup.gho.isCharacterization && homogeneousGroup.gho.characterization)
        origin = `${homogeneousGroup.gho.characterization.name}\n(${originRiskMap[homogeneousGroup.gho.characterization.type].name})`;

      if (!homogeneousGroup.gho.type) origin = `${homogeneousGroup.gho.name}\n(GSE)`;

      if (homogeneousGroup.gho.isHierarchy) {
        const hierarchy = hierarchyData.org.find((hierarchy) => hierarchy.id == homogeneousGroup.gho.id);

        if (hierarchy) origin = `${hierarchy.name}\n(${originRiskMap[hierarchy.typeEnum].name})`;
      }

      const colWidth = (column: ThirdRiskInventoryColumnEnum) =>
        thirdRiskInventoryColumnWidth[column];
      const isVerticalCol = (column: ThirdRiskInventoryColumnEnum) =>
        thirdRiskInventoryVerticalColumns.has(column);

      cells[ThirdRiskInventoryColumnEnum.TYPE] = {
        text: getRiskTypeDisplayLabel(riskData.risk),
        bold: true,
        size: colWidth(ThirdRiskInventoryColumnEnum.TYPE),
        isVertical: isVerticalCol(ThirdRiskInventoryColumnEnum.TYPE),
        ...base,
        ...fill,
      };

      if (!options?.isHideOrigin)
        cells[ThirdRiskInventoryColumnEnum.ORIGIN] = {
          text: origin || '',
          bold: true,
          size: colWidth(ThirdRiskInventoryColumnEnum.ORIGIN),
          ...base,
          ...fill,
        };

      cells[ThirdRiskInventoryColumnEnum.RISK_FACTOR] = {
        text: riskData.risk.name,
        size: colWidth(ThirdRiskInventoryColumnEnum.RISK_FACTOR),
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.RISK] = {
        text: riskData.risk.healthRisk || '',
        size: colWidth(ThirdRiskInventoryColumnEnum.RISK),
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SOURCE] = {
        text: riskData.generateSources.map((gs) => gs.name).join('\n'),
        size: colWidth(ThirdRiskInventoryColumnEnum.SOURCE),
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.EPI] = {
        //! EPI CA
        text: riskData.epis.map((epi) => (options.isHideCA ? epi.equipment : epi.name) || '').join('\n'),
        size: colWidth(ThirdRiskInventoryColumnEnum.EPI),
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.ENG] = {
        text: riskData.engineeringMeasures.map((eng) => eng.name).join('\n'),
        size: colWidth(ThirdRiskInventoryColumnEnum.ENG),
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.ADM] = {
        text: riskData.administrativeMeasures.map((adm) => adm.name).join('\n'),
        size: colWidth(ThirdRiskInventoryColumnEnum.ADM),
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SEVERITY] = {
        text: String(riskData.risk.severity),
        size: colWidth(ThirdRiskInventoryColumnEnum.SEVERITY),
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.PROBABILITY] = {
        text: String(riskData.probability || '-'),
        size: colWidth(ThirdRiskInventoryColumnEnum.PROBABILITY),
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL] = {
        text: riskOccupational?.label || '',
        ...base,
        ...(riskOccupational.level > 3 ? attention : {}),
        borders: {
          ...borderNoneStyle,
          right: whiteBorder,
          top: whiteColumnBorder,
        },
        size: colWidth(ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL),
        isVertical: isVerticalCol(ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL),
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.RECOMMENDATIONS] = {
        text: riskData.recommendations
          .filter((rec) => !shouldHideRecommendationInPgr(riskData.recommendationsData, rec.id))
          .map((rec) => rec.name)
          .join('\n'),
        size: colWidth(ThirdRiskInventoryColumnEnum.RECOMMENDATIONS),
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SEVERITY_AFTER] = {
        text: String(riskData.risk.severity),
        size: colWidth(ThirdRiskInventoryColumnEnum.SEVERITY_AFTER),
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.PROBABILITY_AFTER] = {
        text: String(riskData.probabilityAfter || riskData.probability || '-'),
        size: colWidth(ThirdRiskInventoryColumnEnum.PROBABILITY_AFTER),
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER] = {
        text: riskOccupationalAfter?.label || '',
        ...base,
        ...(riskOccupationalAfter.level > 3 ? attention : {}),
        borders: { ...borderNoneStyle, top: whiteColumnBorder },
        size: colWidth(ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER),
        isVertical: isVerticalCol(ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER),
        ...fill,
      };

      const rows = riskFactorsMap.get(riskData.risk.type) || [];
      riskFactorsMap.set(riskData.risk.type, [...rows, cells.filter(Boolean)]);
    });

  riskFactorsMap.forEach((rows) => {
    riskInventoryData.push(
      ...rows.map((cells) => {
        const clone = [...cells];
        return clone;
      }, []),
    );
  });

  return riskInventoryData;
};
