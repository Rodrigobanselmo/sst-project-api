import { HomoTypeEnum } from '@prisma/client';

import { originRiskMap } from '../../../../../../../shared/constants/maps/origin-risk';
import { palette } from '../../../../../../../shared/constants/palette';
import { getMatrizRisk } from '../../../../../../../shared/utils/matriz';
import { sortData } from '../../../../../../../shared/utils/sorts/data.sort';
import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IRiskDataJson, QuantityTypeEnum } from '../../../../../../company/interfaces/risk-data-json.types';
import { borderStyleGlobal } from '../../../../base/config/styles';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityHeatColumnEnum } from './quantityHeat.constant';
import sortArray from 'sort-array';

export const quantityHeatConverter = (riskGroupData: RiskFactorGroupDataEntity, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData.data
    .filter((row) => {
      if (!row.json || !row.isQuantity) return false;
      const json = row.json as unknown as IRiskDataJson;

      if (json.type !== QuantityTypeEnum.HEAT) return false;
      return !!row.ibtug && !!row.ibtugLEO;
    })
    .sort((a, b) => sortData(a.homogeneousGroup, b.homogeneousGroup, 'name'))
    .map((riskData) => {
      const cells: bodyTableProps[] = [];

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

      const value = riskData.ibtug;
      const limit = riskData.ibtugLEO;

      const ro = getMatrizRisk(riskData.riskFactor.severity, riskData.probability);

      cells[QuantityHeatColumnEnum.ORIGIN] = {
        text: origin || '',
        shading: { fill: palette.table.rowDark.string },
        borders: borderStyleGlobal(palette.common.white.string, {
          right: { size: 15 } as any,
        }),
      };
      cells[QuantityHeatColumnEnum.IBTUG] = {
        text: String(value) || '',
        shading: { fill: palette.table.rowDark.string },
        borders: borderStyleGlobal(palette.common.white.string, {}),
      };
      cells[QuantityHeatColumnEnum.LT] = {
        text: String(limit) || '',
        shading: { fill: palette.table.rowDark.string },
        borders: borderStyleGlobal(palette.common.white.string, {}),
      };
      cells[QuantityHeatColumnEnum.RO] = {
        text: ro.table || '',
        shading: { fill: palette.table.header.string },
        borders: borderStyleGlobal(palette.common.white.string, {
          left: { size: 15 } as any,
        }),
      };

      rows.push(cells);
    });

  return sortArray(rows, {
    by: ['name'],
    computed: {
      name: (v) => {
        return v[QuantityHeatColumnEnum.ORIGIN]?.text || '';
      },
    },
  });
};
