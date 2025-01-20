import { RiskFactorsEnum } from '@prisma/client';
import { AlignmentType } from 'docx';
import { palette } from '../../../../../constants/palette';
import {
  HierarchyMapData,
  IDocumentRiskGroupDataConverter,
  IGHODataConverter,
} from '../../../../../converter/hierarchy.converter';

import { RiskDataModel } from '@/@v2/documents/domain/models/risk-data.model';
import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { sortNumber } from '@/@v2/shared/utils/sorts/number.sort';
import { sortString } from '@/@v2/shared/utils/sorts/string.sort';
import { matrixRiskMap } from '../../../../../constants/matriz-risk-map';
import { originRiskMap } from '../../../../../constants/origin-risk';
import { riskMap } from '../../../../../constants/risks-map';
import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { whiteBorder, whiteColumnBorder } from '../../elements/header';
import { ThirdRiskInventoryColumnEnum } from './third.constant';

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
    const foundHierarchy = riskData.risk.documentsRequirements.find(
      (doc) => !!hierarchyData.org.find((hierarchy) => hierarchy.id === doc.hierarchyId),
    );
    if (foundHierarchy && foundHierarchy.isPGR === false) return false;
  }

  return true;
}

export const dataConverter = (
  riskGroup: IDocumentRiskGroupDataConverter,
  hierarchyData: HierarchyMapData,
  isByGroup: boolean,
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

      cells[ThirdRiskInventoryColumnEnum.TYPE] = {
        text: riskMap[riskData.risk.type]?.label || '',
        bold: true,
        size: 4,
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.ORIGIN] = {
        text: origin || '',
        bold: true,
        size: 6,
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.RISK_FACTOR] = {
        text: riskData.risk.name,
        size: 10,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.RISK] = {
        text: riskData.risk.healthRisk || '',
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SOURCE] = {
        text: riskData.generateSources.map((gs) => gs.name).join('\n'),
        size: 10,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.EPI] = {
        //! EPI CA
        text: riskData.epis.map((epi) => `${epi.equipment} CA: ${epi.ca}`).join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.ENG] = {
        text: riskData.egineeringMeasures.map((eng) => eng.name).join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.ADM] = {
        text: riskData.administrativeMeasures.map((adm) => adm.name).join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SEVERITY] = {
        text: String(riskData.risk.severity),
        size: 1,
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.PROBABILITY] = {
        text: String(riskData.probability || '-'),
        size: 1,
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
        size: 3,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.RECOMMENDATIONS] = {
        text: riskData.recommendations.map((rec) => rec.name).join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SEVERITY_AFTER] = {
        text: String(riskData.risk.severity),
        size: 1,
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.PROBABILITY_AFTER] = {
        text: String(riskData.probabilityAfter || riskData.probability || '-'),
        size: 1,
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER] = {
        text: riskOccupationalAfter?.label || '',
        ...base,
        ...(riskOccupationalAfter.level > 3 ? attention : {}),
        borders: { ...borderNoneStyle, top: whiteColumnBorder },
        size: 3,
        ...fill,
      };

      const rows = riskFactorsMap.get(riskData.risk.type) || [];
      riskFactorsMap.set(riskData.risk.type, [...rows, cells]);
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
