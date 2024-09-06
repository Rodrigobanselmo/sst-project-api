


import { DocumentVersionModel } from '@/@v2/documents/domain/models/document-version.model';
import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { sortNumber } from '@/@v2/shared/utils/sorts/number.sort';
import { sortString } from '@/@v2/shared/utils/sorts/string.sort';
import dayjs from 'dayjs';
import { borderStyleGlobal } from '../../../base/config/styles';
import { matrixRiskMap } from '../../../constants/matriz-risk-map';
import { originRiskMap } from '../../../constants/origin-risk';
import { palette } from '../../../constants/palette';
import { IHierarchyMap, IRiskGroupDataConverter } from '../../../converter/hierarchy.converter';
import { ActionPlanColumnEnum } from './actionPlan.constant';
import { bodyTableProps } from './elements/body';

export const actionPlanConverter = (
  riskGroup: IRiskGroupDataConverter[],
  documentVersion: DocumentVersionModel,
  hierarchyTree: IHierarchyMap,
) => {
  const homogeneousGroupsMap = new Map<string, bodyTableProps[][]>();
  const actionPlanData: bodyTableProps[][] = [];

  riskGroup
    .sort((a, b) => sortString(a.riskData.risk.name, b.riskData.risk.name))
    .sort((a, b) => sortNumber(b.riskData.level, a.riskData.level))
    .map((riskData) => {
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

      return { ...riskData, origin };
    })
    .sort((a, b) => sortString(a.origin, b.origin))
    .forEach(({ origin, ...riskData }) => {
      const dataRecs = riskData.riskData.recommendationsData;
      riskData.riskData.recommendations.forEach((rec) => {
        const cells: bodyTableProps[] = [];

        const dataRecFound = dataRecs?.find((dataRec) => dataRec.recommendationId == rec.id);
        const responsibleName = dataRecFound?.responsibleName || '';
        const level = riskData.riskData.level;

        const getDue = () => {
          const months = documentVersion.documentBase.data.getMonthsPeriodLevel(level);

          if (dataRecFound && dataRecFound.endDate) {
            return dayjs(dataRecFound.endDate);
          }

          if (months) return dayjs(documentVersion.documentBase.validityStart).add(months + 1, 'months');

          return false;
        };

        const due = getDue();
        const dueText = due ? due.format('D [de] MMMM YYYY') : level === 6 ? 'ação imediata' : 'sem prazo';

        cells[ActionPlanColumnEnum.ITEM] = {
          text: '',
          size: 2,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.ORIGIN] = {
          text: origin || '',
          size: 5,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.RISK] = {
          text: riskData.riskData.risk.name,
          size: 10,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.SOURCE] = {
          text: riskData.riskData.generateSources.map((gs) => gs.name).join('\n'),
          size: 10,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.SEVERITY] = {
          text: String(riskData.riskData.risk.severity),
          size: 1,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.PROBABILITY] = {
          text: String(riskData.riskData.probability || '-'),
          size: 1,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.RO] = {
          text: matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, riskData.riskData.probability)].label,
          size: 5,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.INTERVENTION] = {
          text: matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, riskData.riskData.probability)].intervention,
          size: 5,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.RECOMMENDATION] = {
          text: rec.name,
          size: 10,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.RESPONSIBLE] = {
          text: responsibleName,
          size: 5,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.DUE] = {
          text: dueText,
          size: 5,
          borders: borderStyleGlobal(palette.common.white.string),
        };

        const rows = homogeneousGroupsMap.get(riskData.homogeneousGroup.gho.id) || [];
        homogeneousGroupsMap.set(riskData.homogeneousGroup.gho.id, [...rows, cells]);
      });
    });

  let i = 1;

  homogeneousGroupsMap.forEach((rows) => {
    actionPlanData.push(
      ...rows.map((cells) => {
        const clone = [...cells];
        clone[0] = { ...clone[0], text: String(i) };
        i++;

        return clone;
      }, []),
    );
  });

  return actionPlanData;
};
