import { HomoTypeEnum } from '@prisma/client';

import { originRiskMap } from '../../../../../../../shared/constants/maps/origin-risk';
import { palette } from '../../../../../../../shared/constants/palette';
import { getMatrizRisk } from '../../../../../../../shared/utils/matriz';
import { sortData } from '../../../../../../../shared/utils/sorts/data.sort';
import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IRiskDataJson, IRiskDataJsonRadiation, QuantityTypeEnum } from '../../../../../../company/interfaces/risk-data-json.types';
import { borderStyleGlobal } from '../../../../base/config/styles';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityRadColumnEnum } from './quantityRad.constant';

export const quantityRadConverter = (riskGroupData: RiskFactorGroupDataEntity, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData.data
    .filter((row) => {
      if (!row.json || !row.isQuantity) return false;
      const json = row.json as unknown as IRiskDataJson;

      if (json.type !== QuantityTypeEnum.RADIATION) return false;
      return Object.entries(json).some(([key, value]) => {
        return key.includes('dose') && value;
      });
    })
    .sort((a, b) => sortData(a.homogeneousGroup, b.homogeneousGroup, 'name'))
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

      const json = riskData.json as unknown as IRiskDataJsonRadiation;
      const array = [
        {
          bodyPart: 'Corpo Inteiro',
          employee: json.doseFB,
          prob: json.doseFBProb,
          public: json.doseFBPublic,
          publicProb: json.doseFBPublicProb,
        },
        {
          bodyPart: 'Cristalino',
          employee: json.doseEye,
          prob: json.doseEyeProb,
          public: json.doseEyePublic,
          publicProb: json.doseEyePublicProb,
        },
        {
          bodyPart: 'Pele',
          employee: json.doseSkin,
          prob: json.doseSkinProb,
          public: json.doseSkinPublic,
          publicProb: json.doseSkinPublicProb,
        },
        {
          bodyPart: 'Mãos e pés',
          employee: json.doseHand,
          prob: json.doseHandProb,
        },
      ];
      array.forEach((value) => {
        const cells: bodyTableProps[] = [];
        if (typeof value?.prob === 'number' || typeof value?.publicProb === 'number') {
          const prob = getMatrizRisk(riskData.riskFactor.severity, value.prob);
          const publicProb = getMatrizRisk(riskData.riskFactor.severity, value.publicProb);

          cells[QuantityRadColumnEnum.ORIGIN] = {
            text: origin || '',
            shading: { fill: palette.table.header.string },
            borders: borderStyleGlobal(palette.common.white.string, {
              right: { size: 15 } as any,
            }),
          };
          cells[QuantityRadColumnEnum.BODY_PART] = {
            text: value.bodyPart || '-',
            shading: { fill: palette.table.row.string },
            borders: borderStyleGlobal(palette.common.white.string, {}),
          };
          cells[QuantityRadColumnEnum.EMPLOYEE] = {
            text: value.employee || '-',
            shading: { fill: palette.table.row.string },
            borders: borderStyleGlobal(palette.common.white.string, {}),
          };
          cells[QuantityRadColumnEnum.RO_EMPLOYEE] = {
            text: value.prob && prob ? prob.table : '-',
            shading: { fill: palette.table.rowDark.string },
            borders: borderStyleGlobal(palette.common.white.string, {
              right: { size: 15 } as any,
            }),
          };
          cells[QuantityRadColumnEnum.CUSTOMER] = {
            text: value.public || '-',
            shading: { fill: palette.table.row.string },
            borders: borderStyleGlobal(palette.common.white.string, {}),
          };
          cells[QuantityRadColumnEnum.RO_CUSTOMER] = {
            text: value.publicProb && publicProb ? publicProb.table : '-',
            shading: { fill: palette.table.rowDark.string },
            borders: borderStyleGlobal(palette.common.white.string, {}),
          };

          rows.push(cells);
        }
      });
    });

  return rows;
};
