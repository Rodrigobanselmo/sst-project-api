import { originRiskMap } from './../../../../../../shared/constants/maps/origin-risk';
import { HomoTypeEnum } from '@prisma/client';
import { hierarchyList } from '../../../../../../shared/constants/lists/hierarchy.list';
import { palette } from '../../../../../../shared/constants/palette';
import { sortNumber } from '../../../../../../shared/utils/sorts/number.sort';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';
import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { bodyTableProps, emptyCellName } from './elements/body';
import { headerTableProps } from './elements/header';
import { HierarchyPlanColumnEnum, HierarchyPlanMap } from './hierarchyHomoOrg.constant';
import { borderStyleGlobal } from '../../../base/config/styles';

export type ConverterProps = {
  showHomogeneous?: boolean;
  showHomogeneousDescription?: boolean;
  showDescription?: boolean;
  type?: HomoTypeEnum | HomoTypeEnum[] | undefined;
  groupIdFilter?: string | undefined;
};

type IHierarchyDataRecord<T> = {
  data: IHierarchyPlan<T>;
  name: string;
  type: string;
  numEmployees: string;
  description: string;
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
  { showDescription, showHomogeneous, showHomogeneousDescription, type, groupIdFilter }: ConverterProps = {
    showHomogeneous: false,
    showHomogeneousDescription: false,
    showDescription: true,
    type: undefined,
    groupIdFilter: undefined,
  },
) => {
  let hasAtLeastOneDescription = false;
  const allHierarchyPlan = {} as Record<string, IHierarchyPlan<any>>;
  const hierarchyColumns = {} as Record<string, number>;

  (function mapAllHierarchyPlan() {
    hierarchyData.forEach((hierarchiesData) => {
      const highParent = hierarchiesData.org[0];

      const org = [...hierarchyList, 'EMPLOYEE'].map((orgType) => {
        const hierarchyData = hierarchiesData.org.find((org) => org.typeEnum === orgType);

        if (hierarchiesData.descRh) hasAtLeastOneDescription = true;

        if (!hierarchyData) {
          return {
            type: orgType,
            typeEnum: orgType,
            name: emptyCellName,
            id: hierarchyEmptyId,
            homogeneousGroupIds: [],
            homogeneousGroup: '',
            employeesLength: hierarchiesData.employeesLength,
            description: hierarchiesData.descRh,
          };
        }

        return {
          ...hierarchyData,
          ...(showHomogeneous ? {} : { homogeneousGroupIds: [highParent.id] }),
          employeesLength: hierarchiesData.employeesLength,
          description: hierarchiesData.descRh,
        };
      });

      hierarchiesData.org.forEach((hierarchyData) => {
        (showHomogeneous ? hierarchyData.homogeneousGroupIds : [highParent.id]).forEach((homogeneousGroupId) => {
          if (!allHierarchyPlan[homogeneousGroupId]) allHierarchyPlan[homogeneousGroupId] = {};

          const loop = (allHierarchyPlanLoop: IHierarchyPlan<any>, index: number) => {
            const hierarchyId = org[index].id;
            const hierarchyName = org[index]?.name;
            const hierarchyType = org[index].typeEnum;
            const hierarchyEmployees = org[index]?.employeesLength || 0;
            const hierarchyDesc = org[index]?.description || 0;
            if (hierarchyId !== hierarchyEmptyId) hierarchyColumns[hierarchyType as any] = 0;

            if (!allHierarchyPlanLoop[hierarchyId])
              allHierarchyPlanLoop[hierarchyId] = {
                type: hierarchyType as any,
                data: {},
                name: hierarchyName,
                numEmployees: String(hierarchyEmployees),
                description: hierarchyDesc || '',
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

  const mockedColumns = [HierarchyPlanMap[HierarchyPlanColumnEnum.GSE], HierarchyPlanMap[HierarchyPlanColumnEnum.DESCRIPTION]].map<headerTableProps>(({ ...column }) => {
    delete column.position;
    return column;
  });

  if (showHomogeneous && !showHomogeneousDescription) mockedColumns.slice(0, 1);

  function setHeaderTable() {
    const row = showHomogeneous ? [...mockedColumns] : [];
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

    const generateRow = (): bodyTableProps[] => Array.from({ length: columnsLength }).map(() => ({}));

    Object.entries(allHierarchyPlan)
      .sort(([a, c], [b, d]) => (showHomogeneous ? sortString(homoGroupTree[a], homoGroupTree[b], 'name') : sortString(c[0], d[0], 'name')))
      .forEach(([homogeneousGroupId, firstHierarchyPlan]) => {
        const homo = homoGroupTree[homogeneousGroupId];
        let name = homo ? homo.name : '';

        if (showHomogeneous) {
          if (!homo) return;
          if (!type && homo && homo.type) return;
          if (type && !Array.isArray(type) && homo.type !== type) return;
          if (type && Array.isArray(type) && !type.includes(homo.type)) return;

          if (groupIdFilter && homo.id != groupIdFilter) return;

          if (homo.environment) {
            name = `${homo.environment.name}\n(${originRiskMap[homo.environment.type].name})`;
          }

          if (homo.characterization) name = `${homo.characterization.name}\n(${originRiskMap[homo.characterization.type].name})`;
        }

        const row = generateRow();
        const firstPosition = rowsPosition;
        if (showHomogeneous) {
          row[0] = {
            text: name,
            borders: borderStyleGlobal(palette.common.white.string),
          };
          if (showHomogeneousDescription)
            row[1] = {
              text: homo.description || ' ',
              borders: borderStyleGlobal(palette.common.white.string),
            };
        }
        rows[rowsPosition] = row;

        const loop = (map: IHierarchyPlan<any>) => {
          const hierarchyArray = Object.entries(map);
          let totalRowsToSpan = 0;

          hierarchyArray.forEach(([, hierarchyData]) => {
            const firstPosition = rowsPosition;
            const hierarchyColumnTypePosition = hierarchyColumns[hierarchyData.type];
            const indexRowSpan = hierarchyColumnTypePosition;

            if (!rows[rowsPosition]) rows[rowsPosition] = generateRow();

            rows[rowsPosition][hierarchyColumnTypePosition] = {
              text: hierarchyData.name,
              employee: hierarchyData.numEmployees,
              description: hierarchyData.description,
              borders: borderStyleGlobal(palette.common.white.string),
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

  bodyData.forEach((row) => {
    const employees = row[row.length - 1].employee;
    const description = row[row.length - 1].description;

    if (showDescription && hasAtLeastOneDescription)
      row[row.length] = {
        text: description,
        borders: borderStyleGlobal(palette.common.white.string),
      };
    row[row.length] = {
      text: employees,
      borders: borderStyleGlobal(palette.common.white.string),
    };
  });

  if (showDescription && hasAtLeastOneDescription)
    headerData[headerData.length] = {
      text: 'Descrição do cargo',
      borders: borderStyleGlobal(palette.common.white.string),
      size: 5,
    };

  headerData[headerData.length] = {
    text: 'Nº',
    borders: borderStyleGlobal(palette.common.white.string),
    size: 1,
  };

  return {
    bodyData,
    headerData,
  };
};
