import { DocumentDataPGRDto } from './../../../../../../sst/dto/document-data-pgr.dto';
import { DocumentDataEntity } from './../../../../../../sst/entities/documentData.entity';
import { HomoTypeEnum } from '@prisma/client';

import { palette } from '../../../../../../../shared/constants/palette';
import { sortData } from '../../../../../../../shared/utils/sorts/data.sort';
import { originRiskMap } from './../../../../../../../shared/constants/maps/origin-risk';
import { getMatrizRisk } from './../../../../../../../shared/utils/matriz';
import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { borderStyleGlobal } from './../../../../base/config/styles';
import { IRiskDataJson, IRiskDataJsonNoise, QuantityTypeEnum } from './../../../../../../company/interfaces/risk-data-json.types';
import { IHierarchyMap } from './../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityNoiseColumnEnum } from './quantityNoise.constant';
import sortArray from 'sort-array';

export const quantityNoiseConverter = (riskGroupData: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData.data
    .filter((row) => {
      if (!row.json || !row.isQuantity) return false;
      const json = row.json as unknown as IRiskDataJson;

      if (json.type !== QuantityTypeEnum.NOISE) return false;
      if (!riskGroupData.isQ5) {
        return !!json.ltcatq3;
      }

      if (riskGroupData.isQ5) {
        return !!json.ltcatq5 || !!json.nr15q5;
      }
    })
    .sort((a, b) => sortData(a.homogeneousGroup, b.homogeneousGroup, 'name'))
    .map((riskData) => {
      const cells: bodyTableProps[] = [];

      const json = riskData.json as unknown as IRiskDataJsonNoise;

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

      const value = riskGroupData.isQ5 ? String(Math.max(Number(json?.ltcatq5 || 0), Number(json?.nr15q5 || 0))) : json.ltcatq3;

      const ro = getMatrizRisk(riskData.riskFactor.severity, riskData.probability);

      cells[QuantityNoiseColumnEnum.ORIGIN] = {
        text: origin || '',
        shading: { fill: palette.table.rowDark.string },
        borders: borderStyleGlobal(palette.common.white.string, {
          right: { size: 15 } as any,
        }),
      };
      cells[QuantityNoiseColumnEnum.DB] = {
        text: value || '',
        shading: { fill: palette.table.rowDark.string },
      };
      cells[QuantityNoiseColumnEnum.RO] = {
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
        return v[QuantityNoiseColumnEnum.ORIGIN]?.text || '';
      },
    },
  });
};
