/* eslint-disable prettier/prettier */
import { RiskFactorGroupDataEntity } from 'src/modules/checklist/entities/riskGroupData.entity';
import { ActionPlanColumnEnum } from './actionPlan.constant';
import { bodyTableProps } from './elements/body';
import { getMatrizRisk } from '../../../matriz';

export const actionPlanConverter = (riskGroup: RiskFactorGroupDataEntity) => {
  const homogeneousGroupsMap = new Map<string, bodyTableProps[][]>();
  const actionPlanData: bodyTableProps[][] = [];

  riskGroup.data.forEach((riskData) => {
    const cells: bodyTableProps[] = [];

    cells[ActionPlanColumnEnum.ITEM] = {text: '',size: 2};
    cells[ActionPlanColumnEnum.GSE] = { text: riskData.homogeneousGroup.name ,size: 5};
    cells[ActionPlanColumnEnum.RISK] = { text: riskData.riskFactor.name ,size: 10};
    cells[ActionPlanColumnEnum.SOURCE] = { text: riskData.generateSources.map((gs)=>gs.name).join('\n') ,size: 10};
    cells[ActionPlanColumnEnum.SEVERITY] = { text: String(riskData.riskFactor.severity) ,size: 1};
    cells[ActionPlanColumnEnum.PROBABILITY] = { text:  String(riskData.probability) ,size: 1};
    cells[ActionPlanColumnEnum.OR] = { text: getMatrizRisk(riskData.riskFactor.severity, riskData.probability).label ,size: 5};
    cells[ActionPlanColumnEnum.INTERVENTION] = { text: getMatrizRisk(riskData.riskFactor.severity, riskData.probability).intervention ,size: 5};
    cells[ActionPlanColumnEnum.RECOMMENDATION] = { text: riskData.recs.map((rec)=>rec.recName).join('\n') ,size: 10};
    cells[ActionPlanColumnEnum.RESPONSIBLE] = { text: '' ,size: 5};
    cells[ActionPlanColumnEnum.DUE] = { text: '' ,size: 5};

    const rows = homogeneousGroupsMap.get(riskData.homogeneousGroupId) || [];
    homogeneousGroupsMap.set(riskData.homogeneousGroupId, [...rows, cells]);
  });

  let i = 1;

  homogeneousGroupsMap.forEach((rows) => {
    actionPlanData.push(...rows.map((cells) => {
      const clone = [...cells];
      clone[0] = { ...clone[0], text: String(i) }
      i ++

      return clone
    },[]));
  })

  return actionPlanData;
};
