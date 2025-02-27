import sortArray from 'sort-array';

import { palette } from '../../../../constants/palette';
import { borderStyleGlobal } from './../../../../base/config/styles';

import { DocumentVersionModel } from '@/@v2/documents/domain/models/document-version.model';
import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { sortData } from '@/@v2/shared/utils/sorts/data.sort';
import { matrixRiskMap } from '@/modules/documents/constants/matrizRisk.constant';
import { originRiskMap } from '../../../../constants/origin-risk';
import { IHierarchyMap, IRiskGroupDataConverter } from './../../../../converter/hierarchy.converter';
import { bodyTableProps } from './elements/body';
import { QuantityNoiseColumnEnum } from './quantityNoise.constant';

export const quantityNoiseConverter = (
  riskGroupData: IRiskGroupDataConverter[],
  documentVersion: DocumentVersionModel,
  hierarchyTree: IHierarchyMap,
) => {
  const rows: bodyTableProps[][] = [];

  riskGroupData
    .filter(({ riskData }) => {
      if (!riskData.isQuantity) return false;

      if (!riskData.quantityNoise) return false;
      if (!documentVersion.documentBase.data.isQ5) {
        return !!riskData.quantityNoise.ltcatq3;
      }

      if (documentVersion.documentBase.data.isQ5) {
        return !!riskData.quantityNoise.ltcatq5 || !!riskData.quantityNoise.nr15q5;
      }
    })
    .sort((a, b) => sortData(a.homogeneousGroup.gho, b.homogeneousGroup.gho, 'name'))
    .map((riskData) => {
      const cells: bodyTableProps[] = [];

      const json = riskData.riskData

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

      const value = documentVersion.documentBase.data.isQ5
        ? String(Math.max(Number(json.quantityNoise?.ltcatq5 || 0), Number(json.quantityNoise?.nr15q5 || 0)))
        : json.quantityNoise?.ltcatq3;

      const ro = matrixRiskMap[getMatrizRisk(riskData.riskData.risk.severity, riskData.riskData.probability)];

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
