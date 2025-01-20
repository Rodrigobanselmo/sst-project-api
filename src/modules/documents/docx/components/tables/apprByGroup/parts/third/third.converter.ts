import { DocumentDataPGRDto } from './../../../../../../../sst/dto/document-data-pgr.dto';
import { DocumentDataEntity } from './../../../../../../../sst/entities/documentData.entity';
import { sortNumber } from './../../../../../../../../shared/utils/sorts/number.sort';
import { HomoTypeEnum, RiskFactorsEnum } from '@prisma/client';
import { AlignmentType } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../../sst/entities/riskGroupData.entity';
import { riskMap } from '../../../../../../constants/risks.constant';
import { getMatrizRisk } from '../../../../../../../../shared/utils/matriz';
import { palette } from '../../../../../../../../shared/constants/palette';
import { HierarchyMapData, IHierarchyMap } from '../../../../../converter/hierarchy.converter';

import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { whiteBorder, whiteColumnBorder } from '../../elements/header';
import { ThirdRiskInventoryColumnEnum } from './third.constant';
import { originRiskMap } from '../../../../../../../../shared/constants/maps/origin-risk';
import { sortString } from '../../../../../../../../shared/utils/sorts/string.sort';
import { isRiskValidForHierarchyData } from '../../../appr/parts/third/third.converter';

export const dataConverter = (
  riskGroup: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto,
  hierarchyData: HierarchyMapData,
  hierarchyTree: IHierarchyMap,
) => {
  const riskFactorsMap = new Map<RiskFactorsEnum, bodyTableProps[][]>();
  const riskInventoryData: bodyTableProps[][] = [];

  riskGroup.data
    .sort((a, b) => sortString(a.riskFactor.name, b.riskFactor.name))
    .sort((a, b) => sortNumber(riskMap[a.riskFactor.type]?.order, riskMap[b.riskFactor.type]?.order))
    .forEach((riskData) => {
      if (!isRiskValidForHierarchyData({ hierarchyData, riskData, isByGroup: true })) return;

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

      const riskOccupational = getMatrizRisk(riskData.riskFactor.severity, riskData.probability);
      const riskOccupationalAfter = getMatrizRisk(riskData.riskFactor.severity, riskData.probabilityAfter);

      let origin: string;

      if (riskData.homogeneousGroup.environment)
        origin = `${riskData.homogeneousGroup.environment.name}\n(${originRiskMap[riskData.homogeneousGroup.environment.type].name})`;

      if (riskData.homogeneousGroup.characterization)
        origin = `${riskData.homogeneousGroup.characterization.name}\n(${originRiskMap[riskData.homogeneousGroup.characterization.type].name})`;

      if (!riskData.homogeneousGroup.type) origin = `${riskData.homogeneousGroup.name}\n(GSE)`;

      if (riskData.homogeneousGroup.type == HomoTypeEnum.HIERARCHY) {
        const hierarchy = hierarchyTree[riskData.homogeneousGroup.id];

        if (hierarchy) origin = `${hierarchy.name}\n(${originRiskMap[hierarchy.type].name})`;
      }

      cells[ThirdRiskInventoryColumnEnum.TYPE] = {
        text: riskMap[riskData.riskFactor.type]?.label || '',
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
        text: riskData.riskFactor.name,
        size: 10,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.RISK] = {
        text: riskData.riskFactor.risk,
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
        text: riskData.engs.map((eng) => eng.medName).join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.ADM] = {
        text: riskData.adms.map((adm) => adm.medName).join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SEVERITY] = {
        text: String(riskData.riskFactor.severity),
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
        text: riskData.recs.map((rec) => rec.recName).join('\n'),
        size: 7,
        ...base,
      };

      cells[ThirdRiskInventoryColumnEnum.SEVERITY_AFTER] = {
        text: String(riskData.riskFactor.severity),
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

      const rows = riskFactorsMap.get(riskData.riskFactor.type) || [];
      riskFactorsMap.set(riskData.riskFactor.type, [...rows, cells]);
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
