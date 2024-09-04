
import sortArray from 'sort-array';

import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { sortData } from '@/@v2/shared/utils/sorts/data.sort';
import { borderStyleGlobal } from '../../../../base/config/styles';
import { matrixRiskMap } from '../../../../constants/matriz-risk-map';
import { originRiskMap } from '../../../../constants/origin-risk';
import { palette } from '../../../../constants/palette';
import { IDocumentRiskGroupDataConverter, IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityVLColumnEnum } from './quantityVL.constant';

export const quantityVLConverter = ({ riskGroupData }: IDocumentRiskGroupDataConverter, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData
    .filter(({ riskData }) => {
      if (!riskData.isQuantity) return false;

      if (!riskData.quantityVibrationL) return false;
      return !!riskData.quantityVibrationL.aren;
    })
    .sort((a, b) => sortData(a.homogeneousGroup.gho, b.homogeneousGroup.gho, 'name'))
    .map((riskData) => {
      const cells: bodyTableProps[] = [];

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

      const aren = riskData.riskData.quantityVibrationL?.aren;
      const roAren = matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, riskData.riskData.quantityVibrationL?.arenProb)];

      cells[QuantityVLColumnEnum.ORIGIN] = {
        text: origin || '',
        shading: { fill: palette.table.header.string },
        borders: borderStyleGlobal(palette.common.white.string, {
          right: { size: 15 } as any,
        }),
      };
      cells[QuantityVLColumnEnum.AREN] = {
        text: String(aren) || '-',
        shading: { fill: palette.table.row.string },
        borders: borderStyleGlobal(palette.common.white.string, {}),
      };
      cells[QuantityVLColumnEnum.RO_AREN] = {
        text: roAren.table || '-',
        shading: { fill: palette.table.rowDark.string },
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
        return v[QuantityVLColumnEnum.ORIGIN]?.text || '';
      },
    },
  });
};
