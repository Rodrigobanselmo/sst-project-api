
import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { sortData } from '@/@v2/shared/utils/sorts/data.sort';
import sortArray from 'sort-array';
import { borderStyleGlobal } from '../../../../base/config/styles';
import { matrixRiskMap } from '../../../../constants/matriz-risk-map';
import { originRiskMap } from '../../../../constants/origin-risk';
import { palette } from '../../../../constants/palette';
import { IDocumentRiskGroupDataConverter, IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityHeatColumnEnum } from './quantityHeat.constant';

export const quantityHeatConverter = (riskGroupData: IDocumentRiskGroupDataConverter, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData.riskGroupData
    .filter(({ riskData }) => {
      if (!riskData.isQuantity) return false;
      const quantityHeat = riskData.quantityHeat

      if (!quantityHeat) return false;
      return !!quantityHeat.ibtug && !!quantityHeat.ibtugLEO;
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

      const value = riskData.riskData.quantityHeat?.ibtug;
      const limit = riskData.riskData.quantityHeat?.ibtugLEO;

      const ro = matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, riskData.riskData.probability)];

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
