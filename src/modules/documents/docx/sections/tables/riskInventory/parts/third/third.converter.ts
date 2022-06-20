import { RiskFactorsEnum } from '@prisma/client';
import { AlignmentType } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../../checklist/entities/riskGroupData.entity';
import { riskMap } from '../../../../../../constants/risks.constant';
import { getMatrizRisk } from '../../../../../../../../shared/utils/matriz';
import { palette } from '../../../../../../../../shared/constants/palette';
import { MapData } from '../../../../converter/hierarchy.converter';

import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { whiteBorder, whiteColumnBorder } from '../../elements/header';
import { ThirdRiskInventoryColumnEnum } from './third.constant';

export const dataConverter = (
  riskGroup: RiskFactorGroupDataEntity,
  hierarchyData: MapData,
) => {
  const riskFactorsMap = new Map<RiskFactorsEnum, bodyTableProps[][]>();
  const riskInventoryData: bodyTableProps[][] = [];

  riskGroup.data.forEach((riskData) => {
    if (
      !hierarchyData.org.some((org) =>
        org.homogeneousGroupIds.includes(riskData.homogeneousGroupId),
      )
    )
      return;

    const cells: bodyTableProps[] = [];
    // eslint-disable-next-line prettier/prettier
    const base = { borders: {...borderNoneStyle, right:whiteColumnBorder, top:whiteColumnBorder}, margins: { top: 50, bottom: 50 }, alignment: AlignmentType.CENTER}
    const attention = { color: palette.text.attention.string, bold: true };
    const fill = { shading: { fill: palette.table.header.string } };

    const riskOccupational = getMatrizRisk(
      riskData.riskFactor.severity,
      riskData.probability,
    );
    const riskOccupationalAfter = getMatrizRisk(
      riskData.riskFactor.severity,
      riskData.probability,
    );

    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.TYPE] = { text: riskMap[riskData.riskFactor.type]?.label||'', bold: true, size: 4, ...base, ...fill};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.RISK_FACTOR] = { text: riskData.riskFactor.name, size: 10, ...base};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.RISK] = { text: riskData.riskFactor.risk, size: 7, ...base};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.SOURCE] = { text: riskData.generateSources.map((gs)=>gs.name).join('\n'), size: 10, ...base};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.EPI] = { text: riskData.epis.map((epi)=>`${epi.equipment} CA: ${epi.ca}`).join('\n'), size: 7, ...base};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.ENG] = { text: riskData.engs.map((eng)=>eng.medName).join('\n'), size: 7, ...base};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.ADM] = { text: riskData.adms.map((adm)=>adm.medName).join('\n'), size: 7, ...base};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.SEVERITY] = { text: String(riskData.riskFactor.severity), size: 1, ...base, ...fill};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.PROBABILITY] = { text: String(riskData.probability), size: 1, ...base, ...fill};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL] = { text: riskOccupational?.label || '', ...base,...(riskOccupational.level>3?attention:{}), borders:  {...borderNoneStyle, right:whiteBorder, top:whiteColumnBorder}, size: 3, ...fill};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.RECOMMENDATIONS] = { text: riskData.recs.map((rec)=>rec.recName).join('\n'), size: 7, ...base};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.SEVERITY_AFTER] = { text: String(riskData.riskFactor.severity), size: 1, ...base, ...fill};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.PROBABILITY_AFTER] = { text: String(riskData.probabilityAfter||riskData.probability), size: 1, ...base, ...fill};
    // eslint-disable-next-line prettier/prettier
    cells[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER] = { text: riskOccupationalAfter?.label || '', ...base,...(riskOccupationalAfter.level>3?attention:{}), borders: {...borderNoneStyle, top:whiteColumnBorder}, size: 3, ...fill};

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
