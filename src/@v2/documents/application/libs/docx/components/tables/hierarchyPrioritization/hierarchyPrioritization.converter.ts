import { sortNumber } from './../../../../../../shared/utils/sorts/number.sort';
import { riskMap } from './../../../../constants/risks.constant';
import { originRiskMap } from './../../../../../../shared/constants/maps/origin-risk';
import { HierarchyEnum, HomoTypeEnum, RiskFactorsEnum } from '@prisma/client';

import { palette } from '../../../../../../shared/constants/palette';
import { removeDuplicate } from '../../../../../../shared/utils/removeDuplicate';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { getMatrizRisk } from '../../../../../../shared/utils/matriz';
import { IHierarchyData, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { hierarchyMap } from '../appr/parts/first/first.constant';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';
import { borderStyleGlobal } from '../../../base/config/styles';
import { filterRisk } from '../../../../../../shared/utils/filterRisk';

export interface IHierarchyPrioritizationOptions {
  isByGroup?: boolean;
  hierarchyType?: HierarchyEnum;
  homoType?: HomoTypeEnum | HomoTypeEnum[];
}
interface IHomoPositionData {
  data: {
    position: number;
    riskDegree: string;
    riskDegreeLevel: number;
    isQuantity: boolean;
  }[];
}

interface IHierarchyDataType {
  name: string;
  homogeneousGroupIds: string[];
  type?: RiskFactorsEnum;
}

interface IRiskDataMap {
  name: string;
  type?: RiskFactorsEnum;
  // isQuantity: boolean;
  // riskDegree: string;
  // riskDegreeLevel?: number;
  homogeneousGroupIds: {
    id: string;
    isQuantity: boolean;
    riskDegree: string;
    riskDegreeLevel?: number;
  }[];
}

export const hierarchyPrioritizationConverter = (
  riskGroup: RiskFactorGroupDataEntity,
  hierarchyData: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  { hierarchyType = HierarchyEnum.SECTOR, isByGroup = false, homoType }: IHierarchyPrioritizationOptions,
) => {
  const riskGroupData = riskGroup.data.filter((riskData) => filterRisk(riskData));

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
            [...hierarchyMap.homogeneousGroupIds, ...hierarchiesData.allHomogeneousGroupIds],
            { simpleCompare: true },
          ),
          name: hierarchy.name,
        };
      }
    });

    return allHierarchyRecord;
  }

  function getAllHomoGroups() {
    riskGroupData.forEach((riskData) => {
      if (!homoType && riskData.homogeneousGroup.type) return;

      if (homoType && !Array.isArray(homoType) && riskData.homogeneousGroup.type !== homoType) return;

      if (homoType && Array.isArray(homoType) && !homoType.includes(riskData.homogeneousGroup.type)) return;

      const homoId = riskData.homogeneousGroup.id;
      let name = riskData.homogeneousGroup.name;

      if (riskData.homogeneousGroup.environment) {
        name = `${riskData.homogeneousGroup.environment?.name}\n(${originRiskMap[riskData.homogeneousGroup.environment.type].name})`;
      }

      if (riskData.homogeneousGroup.characterization)
        name = `${riskData.homogeneousGroup.characterization.name}\n(${originRiskMap[riskData.homogeneousGroup.characterization.type].name})`;

      //nivel hierarquido da estrtura organizacional
      if (riskData.homogeneousGroup.type == HomoTypeEnum.HIERARCHY) {
        const hierarchy = hierarchyTree[homoId];

        if (hierarchy) name = `${hierarchy.name}\n(${originRiskMap[hierarchy.type].name})`;
      }

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
    riskGroupData.forEach((riskData) => {
      const hasRisk = allRiskRecord[riskData.riskId] || {
        homogeneousGroupIds: [],
      };
      const dataRisk = {} as IRiskDataMap['homogeneousGroupIds'][0];

      const severity = riskData.riskFactor.severity;
      const probability = riskData.probability;

      const riskDegree = getMatrizRisk(severity, probability);
      dataRisk.riskDegree = riskDegree.short;
      dataRisk.riskDegreeLevel = riskDegree.level;
      dataRisk.isQuantity = riskData.isQuantity;
      dataRisk.id = riskData.homogeneousGroupId;

      allRiskRecord[riskData.riskId] = {
        ...hasRisk,
        name: `(${riskData.riskFactor?.type}) ${riskData.riskFactor.name}`,
        type: riskData.riskFactor?.type,
        homogeneousGroupIds: [...hasRisk.homogeneousGroupIds, dataRisk],
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

  const header: (IHierarchyDataType | IRiskDataMap)[] = shouldRiskBeInRows ? allHierarchy : allRisks;

  const body: (IHierarchyDataType | IRiskDataMap)[] = shouldRiskBeInRows ? allRisks : allHierarchy;

  function setHeaderTable() {
    const row = header
      .sort((a, b) => sortString(a, b, 'name'))
      .sort((a, b) => sortNumber(riskMap[a.type as any], riskMap[b.type as any], 'order'))
      .map<headerTableProps>((risk, index) => {
        risk.homogeneousGroupIds.forEach((homogeneousGroup) => {
          const isHomoString = typeof homogeneousGroup === 'string';
          const homogeneousGroupId = isHomoString ? homogeneousGroup : homogeneousGroup.id;

          const homoPosition = HomoPositionMap.get(homogeneousGroupId) || {
            data: [],
          };

          const isQuantity = !isHomoString && 'isQuantity' in homogeneousGroup && !!homogeneousGroup.isQuantity;
          const isDataRisk = !isHomoString && 'riskDegree' in homogeneousGroup && homogeneousGroup.riskDegree;
          const isDataRiskLevel =
            !isHomoString && 'riskDegreeLevel' in homogeneousGroup && homogeneousGroup.riskDegreeLevel;

          HomoPositionMap.set(homogeneousGroupId, {
            data: [
              ...homoPosition.data,
              {
                position: index + 1,
                riskDegree: isDataRisk || '',
                riskDegreeLevel: isDataRiskLevel || 0,
                isQuantity,
              },
            ],
          });
        });
        return {
          text: risk.name,
          font: header.length >= 20 ? 8 : header.length >= 10 ? 10 : 12,
          borders: borderStyleGlobal(palette.common.white.string),
        };
      });

    const groupName = () => {
      if (!homoType) return 'GSE';
      if (homoType === 'HIERARCHY') return 'Nível Hierarquico';
      if (homoType === 'ENVIRONMENT') return 'Ambiente';
      return 'Mão de Obra';
    };

    row.unshift({
      text: isByGroup ? groupName() : hierarchyMap[hierarchyType].text,
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
      .sort((a, b) => sortNumber(riskMap[a.type as any], riskMap[b.type as any], 'order'))
      .map<bodyTableProps[]>((hierarchy) => {
        const row: bodyTableProps[] = Array.from({ length: columnsLength }).map(() => ({
          borders: borderStyleGlobal(palette.common.white.string),
        }));

        row[0] = {
          text: hierarchy.name,
          shading: { fill: palette.table.header.string },
          borders: borderStyleGlobal(palette.common.white.string),
        };

        hierarchy.homogeneousGroupIds.forEach((homogeneousGroup) => {
          const isString = typeof homogeneousGroup === 'string';

          const homogeneousGroupId = isString ? homogeneousGroup : homogeneousGroup.id;

          const isDataRisk = !isString && 'riskDegree' in homogeneousGroup && homogeneousGroup.riskDegree;
          const isDataRiskLevel = !isString && 'riskDegree' in homogeneousGroup && homogeneousGroup.riskDegreeLevel;
          const isDataRiskQuantity = !isString && 'isQuantity' in homogeneousGroup && !!homogeneousGroup.isQuantity;

          const homoPosition = HomoPositionMap.get(homogeneousGroupId);
          if (homoPosition) {
            homoPosition.data.forEach(({ position, riskDegree, riskDegreeLevel, isQuantity }) => {
              row[position] = {
                text: riskDegree || isDataRisk,
                shaded: isQuantity || isDataRiskQuantity,
                borders: borderStyleGlobal(palette.common.white.string),
                attention: (riskDegreeLevel || isDataRiskLevel) >= warnLevelStart,
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
