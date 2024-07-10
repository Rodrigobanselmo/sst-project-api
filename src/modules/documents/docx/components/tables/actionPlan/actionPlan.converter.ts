import { DocumentDataPGRDto } from './../../../../../sst/dto/document-data-pgr.dto';
import { DocumentDataEntity } from './../../../../../sst/entities/documentData.entity';
import { sortString } from './../../../../../../shared/utils/sorts/string.sort';
import { sortNumber } from './../../../../../../shared/utils/sorts/number.sort';
import { HomoTypeEnum } from '@prisma/client';
import clone from 'clone';

import { palette } from '../../../../../../shared/constants/palette';
import { dayjs } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { getMatrizRisk } from '../../../../../../shared/utils/matriz';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { borderStyleGlobal } from '../../../base/config/styles';
import { IHierarchyMap } from '../../../converter/hierarchy.converter';
import { originRiskMap } from './../../../../../../shared/constants/maps/origin-risk';
import { ActionPlanColumnEnum } from './actionPlan.constant';
import { bodyTableProps } from './elements/body';

export const actionPlanConverter = (
  riskGroup: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto,
  hierarchyTree: IHierarchyMap,
) => {
  const homogeneousGroupsMap = new Map<string, bodyTableProps[][]>();
  const actionPlanData: bodyTableProps[][] = [];

  riskGroup.data
    .sort((a, b) => sortString(a.riskFactor.name, b.riskFactor.name))
    .sort((a, b) => sortNumber(b.level, a.level))
    .map((riskData) => {
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
      return { ...riskData, origin };
    })
    .sort((a, b) => sortString(a.origin, b.origin))
    .forEach(({ origin, ...riskData }) => {
      const dataRecs = riskData.dataRecs;
      riskData.recs.forEach((rec) => {
        const cells: bodyTableProps[] = [];

        const dataRecFound = dataRecs?.find((dataRec) => dataRec.recMedId == rec.id);
        const responsibleName = dataRecFound?.responsibleName || '';
        const level = riskData.level || 0;

        const getDue = () => {
          const months = riskGroup[`months_period_level_${level}`];

          if (dataRecFound && dataRecFound.endDate) {
            return dayjs(dataRecFound.endDate);
          }

          if (months) return dayjs(riskGroup?.validityStart).add(months + 1, 'months');

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
          text: riskData.riskFactor.name,
          size: 10,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.SOURCE] = {
          text: riskData.generateSources.map((gs) => gs.name).join('\n'),
          size: 10,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.SEVERITY] = {
          text: String(riskData.riskFactor.severity),
          size: 1,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.PROBABILITY] = {
          text: String(riskData.probability || '-'),
          size: 1,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.RO] = {
          text: getMatrizRisk(riskData.riskFactor.severity, riskData.probability).label,
          size: 5,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.INTERVENTION] = {
          text: getMatrizRisk(riskData.riskFactor.severity, riskData.probability).intervention,
          size: 5,
          borders: borderStyleGlobal(palette.common.white.string),
        };
        cells[ActionPlanColumnEnum.RECOMMENDATION] = {
          text: rec.recName,
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

        const rows = homogeneousGroupsMap.get(riskData.homogeneousGroupId) || [];
        homogeneousGroupsMap.set(riskData.homogeneousGroupId, [...rows, cells]);
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
