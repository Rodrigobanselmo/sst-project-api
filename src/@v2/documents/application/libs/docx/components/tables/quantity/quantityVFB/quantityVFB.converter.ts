
import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { sortData } from '@/@v2/shared/utils/sorts/data.sort';
import sortArray from 'sort-array';
import { borderStyleGlobal } from '../../../../base/config/styles';
import { matrixRiskMap } from '../../../../constants/matriz-risk-map';
import { originRiskMap } from '../../../../constants/origin-risk';
import { palette } from '../../../../constants/palette';
import { IDocumentRiskGroupDataConverter, IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityVFBColumnEnum } from './quantityVFB.constant';

export const quantityVFBConverter = ({ riskGroupData }: IDocumentRiskGroupDataConverter, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData
    .filter(({ riskData }) => {
      if (!riskData.isQuantity) return false;

      if (!riskData.quantityVibrationFB) return false;
      return !!riskData.quantityVibrationFB?.aren || !!riskData.quantityVibrationFB?.vdvr;
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

      const json = riskData.riskData.quantityVibrationFB

      const aren = json?.aren;
      const vdvr = json?.vdvr;

      const roAren = matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, json?.arenProb)];
      const roVdvr = matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, json?.vdvrProb)];

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

  return sortArray(rows, {
    by: ['name'],
    computed: {
      name: (v) => {
        return v[QuantityVFBColumnEnum.ORIGIN]?.text || '';
      },
    },
  });
};
