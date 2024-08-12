import { riskMap } from './../../../../constants/risks.constant';
import { HierarchyEnum, RiskFactorsEnum } from '@prisma/client';

import { palette } from '../../../../../../shared/constants/palette';
import { removeDuplicate } from '../../../../../../shared/utils/removeDuplicate';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';
import { sortNumber } from '../../../../../../shared/utils/sorts/number.sort';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { borderStyleGlobal } from '../../../base/config/styles';
import { IHierarchyData, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { hierarchyMap } from '../appr/parts/first/first.constant';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';
import { filterRisk } from '../../../../../..//shared/utils/filterRisk';

export interface IHierarchyRiskOptions {
  hierarchyType?: HierarchyEnum;
}

interface IHomoPositionData {
  position: number[];
}

interface IHierarchyDataType {
  name: string;
  homogeneousGroupIds: string[];
  type?: RiskFactorsEnum;
}

interface IRiskDataMap {
  name: string;
  type?: RiskFactorsEnum;
  homogeneousGroupIds: string[];
}

export const hierarchyRisksConverter = (
  riskGroup: RiskFactorGroupDataEntity,
  hierarchyData: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  { hierarchyType = HierarchyEnum.SECTOR }: IHierarchyRiskOptions,
) => {
  const allHierarchyRecord = {} as Record<string, IHierarchyDataType>;
  const allRiskRecord = {} as Record<string, IRiskDataMap>;

  const HomoPositionMap = new Map<string, IHomoPositionData>();
  const riskGroupData = riskGroup.data?.filter((riskData) => filterRisk(riskData));

  (function getAllHierarchyByType() {
    hierarchyData.forEach((hierarchiesData) => {
      const hierarchy = hierarchiesData.org.find((hierarchyData) => {
        return hierarchyData.typeEnum === hierarchyType;
      });

      if (hierarchy) {
        const hierarchyMap = allHierarchyRecord[hierarchy.id] || {
          homogeneousGroupIds: [],
        };

        allHierarchyRecord[hierarchy.id] = {
          homogeneousGroupIds: removeDuplicate(
            [...hierarchyMap.homogeneousGroupIds, ...hierarchiesData.allHomogeneousGroupIds],
            { simpleCompare: true },
          ),
          name: hierarchy.name,
        };
      }
    });
  })();

  (function getAllRiskFactors() {
    riskGroupData?.forEach((riskData) => {
      riskData.homogeneousGroupId;

      const hasRisk = allRiskRecord[riskData.riskId] || {
        homogeneousGroupIds: [],
      };

      allRiskRecord[riskData.riskId] = {
        name: `(${riskData.riskFactor?.type}) ${riskData.riskFactor.name}`,
        type: riskData.riskFactor?.type,
        homogeneousGroupIds: [...hasRisk.homogeneousGroupIds, riskData.homogeneousGroupId],
      };
    });
  })();

  const allRisks = Object.values(allRiskRecord);
  const allHierarchy = Object.values(allHierarchyRecord);

  const isLengthGreaterThan50 = allHierarchy.length > 50;
  const shouldRiskBeInRows = isLengthGreaterThan50;

  // const isLengthGreaterThan50 = allRisks.length > 50 && allHierarchy.length > 50;
  // const isRiskLengthGreater = allRisks.length > allHierarchy.length;
  // const shouldRiskBeInRows = isLengthGreaterThan50 || isRiskLengthGreater;

  const header = shouldRiskBeInRows ? allHierarchy : allRisks;
  const body = shouldRiskBeInRows ? allRisks : allHierarchy;

  function setHeaderTable() {
    const row = header
      .sort((a, b) => sortString(a, b, 'name'))
      .sort((a, b) => sortNumber(riskMap[a.type as any], riskMap[b.type as any], 'order'))
      .map<headerTableProps>((risk, index) => {
        risk.homogeneousGroupIds.forEach((homogeneousGroupId) => {
          const homoPosition = HomoPositionMap.get(homogeneousGroupId) || {
            position: [],
          };
          HomoPositionMap.set(homogeneousGroupId, {
            position: [...homoPosition.position, index + 1],
          });
        });
        return {
          text: risk.name,
          font: header.length >= 20 ? 8 : header.length >= 10 ? 10 : 12,
          borders: borderStyleGlobal(palette.common.white.string),
        };
      });

    row.unshift({
      text: hierarchyMap[hierarchyType].text,
      position: 0,
      textDirection: undefined,
      size: row.length < 6 ? 1 : Math.ceil(row.length / 6),
      borders: borderStyleGlobal(palette.common.white.string),
    });

    return row;
  }

  const headerData = setHeaderTable();
  const columnsLength = headerData.length;

  function setBodyTable() {
    return body
      .sort((a, b) => sortString(a, b, 'name'))
      .sort((a, b) => sortNumber(riskMap[a as any], riskMap[b as any], 'order'))
      .map<bodyTableProps[]>((hierarchy) => {
        const row: bodyTableProps[] = Array.from({ length: columnsLength }).map(() => ({
          borders: borderStyleGlobal(palette.common.white.string),
        }));

        row[0] = {
          text: hierarchy.name,
          shading: { fill: palette.table.header.string },
          borders: borderStyleGlobal(palette.common.white.string),
        };

        hierarchy.homogeneousGroupIds.forEach((homogeneousGroupId) => {
          const homoPosition = HomoPositionMap.get(homogeneousGroupId);
          if (homoPosition) {
            homoPosition.position.forEach((position) => {
              row[position] = {
                text: 'X',
                borders: borderStyleGlobal(palette.common.white.string),
              };
            });
          }
        });
        return row;
      });
  }

  const bodyData = setBodyTable();

  return { bodyData, headerData };
};
