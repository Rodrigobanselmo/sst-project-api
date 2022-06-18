import { HierarchyEnum } from '@prisma/client';

import { palette } from '../../../../../../shared/constants/palette';
import { removeDuplicate } from '../../../../../../shared/utils/removeDuplicate';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { getMatrizRisk } from '../../../matriz';
import { IHierarchyData } from '../../converter/hierarchy.converter';
import { hierarchyMap } from '../riskInventory/parts/first/first.constant';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';

export interface IHierarchyPrioritizationOptions {
  isByGroup?: boolean;
  hierarchyType?: HierarchyEnum;
}
interface IHomoPositionData {
  data: { position: number; riskDegree: string; riskDegreeLevel: number }[];
}

interface IHierarchyDataType {
  name: string;
  homogeneousGroupIds: string[];
}

interface IRiskDataMap {
  name: string;
  riskDegree: string;
  homogeneousGroupIds: string[];
  riskDegreeLevel?: number;
}

export const hierarchyPrioritizationConverter = (
  riskGroup: RiskFactorGroupDataEntity,
  hierarchyData: IHierarchyData,
  {
    hierarchyType = HierarchyEnum.SECTOR,
    isByGroup = false,
  }: IHierarchyPrioritizationOptions,
) => {
  const warnLevelStart = 4;
  const allRiskRecord = {} as Record<string, IRiskDataMap>;
  const allHierarchyRecord = {} as Record<string, IHierarchyDataType>;

  const HomoPositionMap = new Map<string, IHomoPositionData>();

  function getAllHierarchyByType() {
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
            [
              ...hierarchyMap.homogeneousGroupIds,
              ...hierarchiesData.allHomogeneousGroupIds,
            ],
            { simpleCompare: true },
          ),
          name: hierarchy.name,
        };
      }
    });

    return allHierarchyRecord;
  }

  function getAllHomoGroups() {
    riskGroup.data.forEach((riskData) => {
      const homoId = riskData.homogeneousGroup.id;
      const name = riskData.homogeneousGroup.name;
      const hierarchyMap = allHierarchyRecord[homoId] || {
        homogeneousGroupIds: [homoId],
      };

      allHierarchyRecord[homoId] = {
        ...hierarchyMap,
        name,
      };
    });
  }

  !isByGroup ? getAllHierarchyByType() : getAllHomoGroups();

  (function getAllRiskFactors() {
    riskGroup.data.forEach((riskData) => {
      riskData.homogeneousGroupId;

      const hasRisk = allRiskRecord[riskData.riskId] || {
        homogeneousGroupIds: [],
        riskDegree: '',
        riskDegreeLevel: 0,
      };

      const severity = riskData.riskFactor.severity;
      const probability = riskData.probability;

      if (!hasRisk.riskDegree) {
        const riskDegree = getMatrizRisk(severity, probability);
        hasRisk.riskDegree = riskDegree.short;
        hasRisk.riskDegreeLevel = riskDegree.level;
      }

      allRiskRecord[riskData.riskId] = {
        ...hasRisk,
        name: riskData.riskFactor.name,
        homogeneousGroupIds: [
          ...hasRisk.homogeneousGroupIds,
          riskData.homogeneousGroupId,
        ],
      };
    });
  })();

  const allRisks = Object.values(allRiskRecord);
  const allHierarchy = Object.values(allHierarchyRecord);

  const isLengthGreaterThan50 =
    allRisks.length > 50 && allHierarchy.length > 50;
  const isRiskLengthGreater = allRisks.length > allHierarchy.length;
  const shouldRiskBeInRows = isLengthGreaterThan50 || isRiskLengthGreater;

  const header: (IHierarchyDataType | IRiskDataMap)[] = shouldRiskBeInRows
    ? allHierarchy
    : allRisks;
  const body: (IHierarchyDataType | IRiskDataMap)[] = shouldRiskBeInRows
    ? allRisks
    : allHierarchy;

  function setHeaderTable() {
    const row = header
      .sort((a, b) => sortString(a, b, 'name'))
      .map<headerTableProps>((risk, index) => {
        risk.homogeneousGroupIds.forEach((homogeneousGroupId) => {
          const homoPosition = HomoPositionMap.get(homogeneousGroupId) || {
            data: [],
          };

          const isDataRisk = 'riskDegree' in risk && risk.riskDegree;
          const isDataRiskLevel =
            'riskDegreeLevel' in risk && risk.riskDegreeLevel;

          HomoPositionMap.set(homogeneousGroupId, {
            data: [
              ...homoPosition.data,
              {
                position: index + 1,
                riskDegree: isDataRisk || '',
                riskDegreeLevel: isDataRiskLevel || 0,
              },
            ],
          });
        });
        return {
          text: risk.name,
          font: header.length >= 20 ? 8 : header.length >= 10 ? 10 : 12,
        };
      });

    row.unshift({
      text: isByGroup ? 'GSE' : hierarchyMap[hierarchyType].text,
      position: 0,
      textDirection: undefined,
      size: row.length < 6 ? 1 : Math.ceil(row.length / 6),
    });

    return row;
  }

  const headerData = setHeaderTable();
  const columnsLength = headerData.length;

  function setBodyTable() {
    return body
      .sort((a, b) => sortString(a, b, 'name'))
      .map<bodyTableProps[]>((hierarchy) => {
        const row: bodyTableProps[] = Array.from({ length: columnsLength }).map(
          () => ({}),
        );

        row[0] = {
          text: hierarchy.name,
          shading: { fill: palette.table.header.string },
        };

        const isDataRisk = 'riskDegree' in hierarchy && hierarchy.riskDegree;
        const isDataRiskLevel =
          'riskDegree' in hierarchy && hierarchy.riskDegreeLevel;

        hierarchy.homogeneousGroupIds.forEach((homogeneousGroupId) => {
          const homoPosition = HomoPositionMap.get(homogeneousGroupId);
          if (homoPosition) {
            homoPosition.data.forEach(
              ({ position, riskDegree, riskDegreeLevel }) => {
                row[position] = {
                  text: riskDegree || isDataRisk,
                  attention:
                    (riskDegreeLevel || isDataRiskLevel) >= warnLevelStart,
                };
              },
            );
          }
        });
        return row;
      });
  }

  const bodyData = setBodyTable();

  return { bodyData, headerData };
};
