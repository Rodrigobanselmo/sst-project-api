/* eslint-disable prettier/prettier */
import { RiskFactorGroupDataEntity } from 'src/modules/checklist/entities/riskGroupData.entity';
import { FirstRiskInventoryColumnEnum } from './parts/first/first.constant';
import { bodyTableProps } from './elements/body';
import { getMatrizRisk } from '../../../matriz';

export const riskInventoryConverter = (riskGroup: RiskFactorGroupDataEntity) => {
  const homogeneousGroupsMap = new Map<string, bodyTableProps[][]>();
  const riskInventoryData: bodyTableProps[][] = [];

  riskGroup.data.forEach((riskData) => {
    const cells: bodyTableProps[] = [];

    // cells[FirstRiskInventoryColumnEnum.ITEM] = {text: '',size: 2};
    // cells[FirstRiskInventoryColumnEnum.GSE] = { text: riskData.homogeneousGroup.name ,size: 5};
    // cells[FirstRiskInventoryColumnEnum.RISK] = { text: riskData.riskFactor.name ,size: 10};
    // cells[FirstRiskInventoryColumnEnum.SOURCE] = { text: riskData.generateSources.map((gs)=>gs.name).join('\n') ,size: 10};
    // cells[FirstRiskInventoryColumnEnum.SEVERITY] = { text: String(riskData.riskFactor.severity) ,size: 1};
    // cells[FirstRiskInventoryColumnEnum.PROBABILITY] = { text:  String(riskData.probability) ,size: 1};
    // cells[FirstRiskInventoryColumnEnum.OR] = { text: getMatrizRisk(riskData.riskFactor.severity, riskData.probability).label ,size: 5};
    // cells[FirstRiskInventoryColumnEnum.INTERVENTION] = { text: getMatrizRisk(riskData.riskFactor.severity, riskData.probability).intervention ,size: 5};
    // cells[FirstRiskInventoryColumnEnum.RECOMMENDATION] = { text: riskData.recs.map((rec)=>rec.recName).join('\n') ,size: 10};
    // cells[FirstRiskInventoryColumnEnum.RESPONSIBLE] = { text: '' ,size: 5};
    // cells[FirstRiskInventoryColumnEnum.DUE] = { text: '' ,size: 5};

    const rows = homogeneousGroupsMap.get(riskData.homogeneousGroupId) || [];
    homogeneousGroupsMap.set(riskData.homogeneousGroupId, [...rows, cells]);
  });

  let i = 1;

  homogeneousGroupsMap.forEach((rows) => {
    riskInventoryData.push(...rows.map((cells) => {
      const clone = [...cells];
      clone[0] = { ...clone[0], text: String(i) }
      i ++

      return clone
    },[]));
  })

  return riskInventoryData;
};
