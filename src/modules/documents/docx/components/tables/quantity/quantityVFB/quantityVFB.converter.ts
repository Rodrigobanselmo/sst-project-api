import { HomoTypeEnum } from '@prisma/client';

import { originRiskMap } from '../../../../../../../shared/constants/maps/origin-risk';
import { palette } from '../../../../../../../shared/constants/palette';
import { getMatrizRisk } from '../../../../../../../shared/utils/matriz';
import { sortData } from '../../../../../../../shared/utils/sorts/data.sort';
import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IRiskDataJson, IRiskDataJsonVibration, QuantityTypeEnum } from '../../../../../../company/interfaces/risk-data-json.types';
import { borderStyleGlobal } from '../../../../base/config/styles';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityVFBColumnEnum } from './quantityVFB.constant';

export const quantityVFBConverter = (riskGroupData: RiskFactorGroupDataEntity, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData.data
    .filter((row) => {
      if (!row.json || !row.isQuantity) return false;
      const json = row.json as unknown as IRiskDataJson;

      if (json.type !== QuantityTypeEnum.VFB) return false;
      return !!json.aren || !!json.vdvr;
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

      const json = riskData.json as unknown as IRiskDataJsonVibration;

      const aren = json.aren;
      const vdvr = json.vdvr;

      const roAren = getMatrizRisk(riskData.riskFactor.severity, riskData.probAren);

      const roVdvr = getMatrizRisk(riskData.riskFactor.severity, riskData.probVdvr);

      cells[QuantityVFBColumnEnum.ORIGIN] = {
        text: origin || '',
        shading: { fill: palette.table.header.string },
        borders: borderStyleGlobal(palette.common.white.string, {
          right: { size: 15 } as any,
        }),
      };
      cells[QuantityVFBColumnEnum.AREN] = {
        text: String(aren) || '-',
        shading: { fill: palette.table.row.string },
        borders: borderStyleGlobal(palette.common.white.string, {}),
      };
      cells[QuantityVFBColumnEnum.RO_AREN] = {
        text: roAren.table || '-',
        shading: { fill: palette.table.rowDark.string },
        borders: borderStyleGlobal(palette.common.white.string, {
          right: { size: 15 } as any,
        }),
      };
      cells[QuantityVFBColumnEnum.VDVR] = {
        text: String(vdvr) || '-',
        shading: { fill: palette.table.row.string },
        borders: borderStyleGlobal(palette.common.white.string, {}),
      };
      cells[QuantityVFBColumnEnum.RO_VDVR] = {
        text: roVdvr.table || '-',
        shading: { fill: palette.table.rowDark.string },
      };

      rows.push(cells);
    });

  return rows;
};
