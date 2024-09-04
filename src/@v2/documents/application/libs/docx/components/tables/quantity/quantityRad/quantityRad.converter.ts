import { HomoTypeEnum } from '@prisma/client';

import { originRiskMap } from '../../../../constants/origin-risk';
import { palette } from '../../../../constants/palette';

import { borderStyleGlobal } from '../../../../base/config/styles';
import { IDocumentRiskGroupDataConverter, IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityRadColumnEnum } from './quantityRad.constant';
import sortArray from 'sort-array';
import { sortData } from '@/@v2/shared/utils/sorts/data.sort';
import { matrixRiskMap } from '../../../../constants/matriz-risk-map';
import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';

export const quantityRadConverter = ({ riskGroupData }: IDocumentRiskGroupDataConverter, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData
    .filter(({ riskData }) => {
      if (!riskData.isQuantity) return false;

      if (!riskData.quantityRadiation) return false;
      return Object.entries(riskData.quantityRadiation).some(([key, value]) => {
        return key.includes('dose') && value;
      });
    })
    .sort((a, b) => sortData(a.homogeneousGroup.gho, b.homogeneousGroup.gho, 'name'))
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

      const json = riskData.riskData.quantityRadiation;
      const array = [
        {
          bodyPart: 'Corpo Inteiro',
          employee: json?.doseFB,
          prob: json?.doseFBProb,
          public: json?.doseFBPublic,
          publicProb: json?.doseFBPublicProb,
        },
        {
          bodyPart: 'Cristalino',
          employee: json?.doseEye,
          prob: json?.doseEyeProb,
          public: json?.doseEyePublic,
          publicProb: json?.doseEyePublicProb,
        },
        {
          bodyPart: 'Pele',
          employee: json?.doseSkin,
          prob: json?.doseSkinProb,
          public: json?.doseSkinPublic,
          publicProb: json?.doseSkinPublicProb,
        },
        {
          bodyPart: 'Mãos e pés',
          employee: json?.doseHand,
          prob: json?.doseHandProb,
        },
      ];
      array.forEach((value) => {
        const cells: bodyTableProps[] = [];
        if (typeof value?.prob === 'number' || typeof value?.publicProb === 'number') {
          const prob = matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, value.prob)];
          const publicProb = matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, value.publicProb)];

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

  return sortArray(rows, {
    by: ['name'],
    computed: {
      name: (v) => {
        return v[QuantityRadColumnEnum.ORIGIN]?.text || '';
      },
    },
  });
};
