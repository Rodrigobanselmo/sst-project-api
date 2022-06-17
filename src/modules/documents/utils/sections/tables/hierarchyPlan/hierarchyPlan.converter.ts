import { HierarchyEnum } from '@prisma/client';
import { sortNumber } from '../../../../../../shared/utils/sorts/number.sort';

import { palette } from '../../../../../../shared/constants/palette';
import { removeDuplicate } from '../../../../../../shared/utils/removeDuplicate';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import {
  IHierarchyData,
  IHierarchyMap,
  IHomoGroupMap,
} from '../../converter/hierarchy.converter';
import { hierarchyMap } from '../riskInventory/parts/first/first.constant';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';
import {
  HierarchyPlanColumnEnum,
  HierarchyPlanMap,
} from './hierarchyPlan.constant';

type IHierarchyDataRecord<T> = {
  data: IHierarchyPlan<T>;
  name: string;
  type: string;
};
export type IHierarchyPlan<T> = Record<string, IHierarchyDataRecord<T>>;

// allHierarchyPlan
// ---------------------------------------------------------------------------------
// ['GROUP_NAME']  ['DIRECTOR_NAME_1'].type = HierarchyEnum.DIRECTORY
// ['GROUP_NAME']  ['DIRECTOR_NAME_1'].data['MANAGER_NAME_1'].data['SECTOR_NAME']...
//                 ['DIRECTOR_NAME_2'].data['MANAGER_NAME_2'].data['SECTOR_NAME']...
//                 ['DIRECTOR_NAME_2'].data['MANAGER_NAME_2'].data['SECTOR_NAME']...
//                                         ['MANAGER_NAME_3'].data['SECTOR_NAME']...

export const hierarchyPlanConverter = (
  hierarchyData: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
) => {
  const allHierarchyPlan = {} as Record<string, IHierarchyPlan<any>>;
  const hierarchyColumns = {} as Record<string, number>;

  (function mapAllHierarchyPlan() {
    hierarchyData.forEach((hierarchiesData) => {
      hierarchiesData.org.forEach((hierarchyData) => {
        hierarchyData.homogeneousGroupIds.forEach((homogeneousGroupId) => {
          if (!allHierarchyPlan[homogeneousGroupId])
            allHierarchyPlan[homogeneousGroupId] = {};

          const loop = (
            allHierarchyPlanLoop: IHierarchyPlan<any>,
            index: number,
          ) => {
            const hierarchyId = hierarchiesData.org[index].id;
            const hierarchyName = hierarchiesData.org[index].name;
            const hierarchyType = hierarchiesData.org[index].typeEnum;
            hierarchyColumns[hierarchyType] = 0;

            if (!allHierarchyPlanLoop[hierarchyId])
              allHierarchyPlanLoop[hierarchyId] = {
                type: hierarchyType,
                data: {},
                name: hierarchyName,
              };

            if (hierarchiesData.org[index + 1]) {
              loop(allHierarchyPlanLoop[hierarchyId].data, index + 1);
            }
          };

          loop(allHierarchyPlan[homogeneousGroupId], 0);
        });
      });
    });
  })();

  const mockedColumns = [
    HierarchyPlanMap[HierarchyPlanColumnEnum.GSE],
    HierarchyPlanMap[HierarchyPlanColumnEnum.DESCRIPTION],
  ].map<headerTableProps>(({ ...column }) => {
    delete column.position;
    return column;
  });

  function setHeaderTable() {
    const row = [...mockedColumns];
    const headerTable = Object.keys(hierarchyColumns)
      .map((type) => {
        return { type, ...HierarchyPlanMap[type] };
      })
      .sort((a, b) => sortNumber(a, b, 'position'))
      .map<headerTableProps>(({ type, ...column }, index) => {
        hierarchyColumns[type] = index + mockedColumns.length;
        delete column.position;
        return column;
      });

    row.push(...headerTable);

    return row;
  }

  const headerData = setHeaderTable();
  const columnsLength = headerData.length;

  function setBodyTable() {
    let rowsPosition = 0;
    const rows: bodyTableProps[][] = [];

    const generateRow = (): bodyTableProps[] =>
      Array.from({ length: columnsLength }).map(() => ({}));

    Object.entries(allHierarchyPlan)
      .sort(([a], [b]) => sortString(a, b))
      .forEach(([homogeneousGroupId, firstHierarchyPlan]) => {
        const row = generateRow();
        const firstPosition = rowsPosition;
        // eslint-disable-next-line prettier/prettier
        row[0] = { text:  homoGroupTree[homogeneousGroupId].name };
        row[1] = { text: homoGroupTree[homogeneousGroupId].description };

        rows[rowsPosition] = row;

        const loop = (map: IHierarchyPlan<any>) => {
          const hierarchyArray = Object.entries(map);
          const firstPosition = rowsPosition;
          let totalRowsToSpan = 0;
          let indexRowSpan = 0;

          hierarchyArray.forEach(([, hierarchyData]) => {
            const hierarchyColumnTypePosition =
              hierarchyColumns[hierarchyData.type];

            indexRowSpan = hierarchyColumnTypePosition;

            if (!rows[rowsPosition]) rows[rowsPosition] = generateRow();

            rows[rowsPosition][hierarchyColumnTypePosition] = {
              text: hierarchyData.name,
            };

            const someRowsToSpan = loop(hierarchyData.data);

            rowsPosition++;
            totalRowsToSpan = totalRowsToSpan + someRowsToSpan;
          });

          if (indexRowSpan)
            rows[firstPosition][indexRowSpan] = {
              ...rows[firstPosition][indexRowSpan],
              rowSpan: totalRowsToSpan,
            };

          return totalRowsToSpan;
        };

        const rowsToSpan = loop(firstHierarchyPlan);
        rows[firstPosition][0] = {
          ...rows[firstPosition][0],
          rowSpan: rowsToSpan,
        };

        return row;
      });

    return rows;
  }

  const bodyData = setBodyTable();

  return { bodyData, headerData };
};
