import { hierarchyList } from '../../../../../../shared/constants/lists/hierarchy.list';
import { palette } from '../../../../../../shared/constants/palette';
import { sortNumber } from '../../../../../../shared/utils/sorts/number.sort';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';
import {
  IHierarchyData,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';
import { bodyTableProps, emptyCellName } from './elements/body';
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

const hierarchyEmptyId = '0';

export const hierarchyPlanConverter = (
  hierarchyData: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
) => {
  const allHierarchyPlan = {} as Record<string, IHierarchyPlan<any>>;
  const hierarchyColumns = {} as Record<string, number>;

  (function mapAllHierarchyPlan() {
    hierarchyData.forEach((hierarchiesData) => {
      const org = hierarchyList.map((type) => {
        const hierarchyData = hierarchiesData.org.find(
          (org) => org.typeEnum === type,
        );

        if (!hierarchyData) {
          return {
            type: type,
            typeEnum: type,
            name: emptyCellName,
            id: hierarchyEmptyId,
            homogeneousGroupIds: [],
            homogeneousGroup: '',
          };
        }

        return hierarchyData;
      });

      hierarchiesData.org.forEach((hierarchyData) => {
        hierarchyData.homogeneousGroupIds.forEach((homogeneousGroupId) => {
          if (!allHierarchyPlan[homogeneousGroupId])
            allHierarchyPlan[homogeneousGroupId] = {};

          const loop = (
            allHierarchyPlanLoop: IHierarchyPlan<any>,
            index: number,
          ) => {
            const hierarchyId = org[index].id;
            const hierarchyName = org[index].name;
            const hierarchyType = org[index].typeEnum;
            if (hierarchyId !== hierarchyEmptyId)
              hierarchyColumns[hierarchyType] = 0;

            if (!allHierarchyPlanLoop[hierarchyId])
              allHierarchyPlanLoop[hierarchyId] = {
                type: hierarchyType,
                data: {},
                name: hierarchyName,
              };

            if (org[index + 1]) {
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
        row[0] = { text: homoGroupTree[homogeneousGroupId].name };
        row[1] = { text: homoGroupTree[homogeneousGroupId].description || ' ' };

        rows[rowsPosition] = row;

        const loop = (map: IHierarchyPlan<any>) => {
          const hierarchyArray = Object.entries(map);
          let totalRowsToSpan = 0;

          hierarchyArray.forEach(([, hierarchyData]) => {
            const firstPosition = rowsPosition;
            const hierarchyColumnTypePosition =
              hierarchyColumns[hierarchyData.type];
            const indexRowSpan = hierarchyColumnTypePosition;

            if (!rows[rowsPosition]) rows[rowsPosition] = generateRow();

            rows[rowsPosition][hierarchyColumnTypePosition] = {
              text: hierarchyData.name,
            };

            const childrenRowsToSpan = loop(hierarchyData.data);

            if (indexRowSpan)
              rows[firstPosition][indexRowSpan] = {
                ...rows[firstPosition][indexRowSpan],
                rowSpan: childrenRowsToSpan,
              };

            totalRowsToSpan = childrenRowsToSpan + totalRowsToSpan;
            rowsPosition++;
          });

          return totalRowsToSpan || 1;
        };

        const rowsToSpan = loop(firstHierarchyPlan);

        rows[firstPosition][0] = {
          ...rows[firstPosition][0],
          rowSpan: rowsToSpan,
          shading: { fill: palette.table.header.string },
        };
        rows[firstPosition][1] = {
          ...rows[firstPosition][1],
          rowSpan: rowsToSpan,
        };

        return row;
      });

    return rows.map((row) => row.filter((row) => row.text));
  }

  const bodyData = setBodyTable();

  return { bodyData, headerData };
};
