import { RiskFactorsEnum } from '@prisma/client';
import { AlignmentType } from 'docx';
import { palette } from '../../../../../constants/palette';
import { HierarchyMapData, IDocumentRiskGroupDataConverter, IHierarchyMap } from '../../../../../converter/hierarchy.converter';

import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { sortNumber } from '@/@v2/shared/utils/sorts/number.sort';
import { sortString } from '@/@v2/shared/utils/sorts/string.sort';
import { matrixRiskMap } from '../../../../../constants/matriz-risk-map';
import { originRiskMap } from '../../../../../constants/origin-risk';
import { riskMap } from '../../../../../constants/risks-map';
import { isRiskValidForHierarchyData } from '../../../appr/parts/third/third.converter';
import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { whiteBorder, whiteColumnBorder } from '../../elements/header';
import { ThirdRiskInventoryColumnEnum } from './third.constant';

export const dataConverter = (
  riskGroup: IDocumentRiskGroupDataConverter,
  hierarchyData: HierarchyMapData,
  hierarchyTree: IHierarchyMap,
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
    .forEach((riskData) => {
      if (
        !isRiskValidForHierarchyData({
          hierarchyData,
          riskData: riskData.riskData,
          isByGroup: true,
          homogeneousGroup: riskData.homogeneousGroup,
        })
      )
        return;

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

      const riskOccupational = matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, riskData.riskData.probability)];
      const riskOccupationalAfter = matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, riskData.riskData.probabilityAfter)];

      let origin: string = '';

      if (riskData.homogeneousGroup.gho.isEnviroment && riskData.homogeneousGroup.gho.characterization)
        origin = `${riskData.homogeneousGroup.gho.characterization.name}\n(${originRiskMap[riskData.homogeneousGroup.gho.characterization.type].name})`;

      if (riskData.homogeneousGroup.gho.isCharacterization && riskData.homogeneousGroup.gho.characterization)
        origin = `${riskData.homogeneousGroup.gho.characterization.name}\n(${originRiskMap[riskData.homogeneousGroup.gho.characterization.type].name})`;

      if (!riskData.homogeneousGroup.gho.type) origin = `${riskData.homogeneousGroup.gho.name}\n(GSE)`;

      if (riskData.homogeneousGroup.gho.isHierarchy) {
        const hierarchy = hierarchyTree[riskData.homogeneousGroup.gho.id];

        if (hierarchy) origin = `${hierarchy.name}\n(${originRiskMap[hierarchy.type].name})`;
      }

      cells[ThirdRiskInventoryColumnEnum.TYPE] = {
        text: riskMap[riskData.riskData.risk.type]?.label || '',
        bold: true,
        size: 4,
        ...base,
        ...fill,
      };

      if (!options?.isHideOrigin)
        cells[ThirdRiskInventoryColumnEnum.ORIGIN] = {
          text: origin || '',
          bold: true,
          size: 6,
          ...base,
          ...fill,
        };

      cells[ThirdRiskInventoryColumnEnum.RISK_FACTOR] = {
        text: riskData.riskData.risk.name,
        size: 10,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.RISK] = {
        text: riskData.riskData.risk.healthRisk || '',
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SOURCE] = {
        text: riskData.riskData.generateSources.map((gs) => gs.name).join('\n'),
        size: 10,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.EPI] = {
        //! EPI CA
        text: riskData.riskData.epis.map((epi) => (options.isHideCA ? epi.equipment : epi.name) || '').join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.ENG] = {
        text: riskData.riskData.engineeringMeasures.map((eng) => eng.name).join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.ADM] = {
        text: riskData.riskData.administrativeMeasures.map((adm) => adm.name).join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SEVERITY] = {
        text: String(riskData.riskData.risk.severity),
        size: 1,
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.PROBABILITY] = {
        text: String(riskData.riskData.probability || '-'),
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
        text: riskData.riskData.recommendations.map((rec) => rec.name).join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SEVERITY_AFTER] = {
        text: String(riskData.riskData.risk.severity),
        size: 1,
        ...base,
        ...fill,
      };

      cells[ThirdRiskInventoryColumnEnum.PROBABILITY_AFTER] = {
        text: String(riskData.riskData.probabilityAfter || riskData.riskData.probability || '-'),
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

      const rows = riskFactorsMap.get(riskData.riskData.risk.type) || [];
      riskFactorsMap.set(riskData.riskData.risk.type, [...rows, cells.filter(Boolean)]);
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
