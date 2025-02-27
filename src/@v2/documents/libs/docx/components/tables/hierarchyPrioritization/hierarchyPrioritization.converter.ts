import { HierarchyEnum, HomoTypeEnum, RiskFactorsEnum } from '@prisma/client';

import { checkValidExistentRisk } from '@/@v2/shared/domain/functions/security/check-valid-existent-risk.func';
import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { removeDuplicate } from '@/@v2/shared/utils/helpers/remove-duplicate';
import { sortNumber } from '@/@v2/shared/utils/sorts/number.sort';
import { sortString } from '@/@v2/shared/utils/sorts/string.sort';
import { riskMap } from '@/modules/documents/constants/risks.constant';
import { originRiskMap } from '@/shared/constants/maps/origin-risk';
import { borderStyleGlobal } from '../../../base/config/styles';
import { matrixRiskMap } from '../../../constants/matriz-risk-map';
import { palette } from '../../../constants/palette';
import { IHierarchyData, IHierarchyMap, IRiskGroupDataConverter } from '../../../converter/hierarchy.converter';
import { hierarchyMap } from '../appr/parts/first/first.constant';
import { bodyTableProps } from './elements/body';
import { headerTableProps } from './elements/header';

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
  riskGroup: IRiskGroupDataConverter[],
  hierarchyData: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  { hierarchyType = HierarchyEnum.SECTOR, isByGroup = false, homoType }: IHierarchyPrioritizationOptions,
) => {
  const riskGroupData = riskGroup.filter(({ riskData }) => checkValidExistentRisk(riskData.risk));

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
          ),
          name: hierarchy.name,
        };
      }
    });

    return allHierarchyRecord;
  }

  function getAllHomoGroups() {
    riskGroupData.forEach((riskData) => {
      if (!homoType && riskData.homogeneousGroup.gho.type) return;

      if (homoType && !Array.isArray(homoType) && riskData.homogeneousGroup.gho.type !== homoType) return;

      if (homoType && Array.isArray(homoType) && !homoType.includes(riskData.homogeneousGroup.gho.type)) return;

      const homoId = riskData.homogeneousGroup.gho.id;
      let name = riskData.homogeneousGroup.gho.name;

      if (riskData.homogeneousGroup.gho.isEnviroment && riskData.homogeneousGroup.gho.characterization) {
        name = `${riskData.homogeneousGroup.gho.characterization?.name}\n(${originRiskMap[riskData.homogeneousGroup.gho.characterization.type].name})`;
      }

      if (riskData.homogeneousGroup.gho.isCharacterization && riskData.homogeneousGroup.gho.characterization) {
        name = `${riskData.homogeneousGroup.gho.characterization.name}\n(${originRiskMap[riskData.homogeneousGroup.gho.characterization.type].name})`;
      }

      //nivel hierarquido da estrtura organizacional
      if (riskData.homogeneousGroup.gho.type == HomoTypeEnum.HIERARCHY) {
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
    riskGroupData.forEach(({ riskData, homogeneousGroup }) => {
      const hasRisk = allRiskRecord[riskData.risk.id] || {
        homogeneousGroupIds: [],
      };
      const dataRisk = {} as IRiskDataMap['homogeneousGroupIds'][0];

      const severity = riskData.risk.severity;
      const probability = riskData.probability;

      const riskDegree = matrixRiskMap[getMatrizRisk(severity, probability)];
      dataRisk.riskDegree = riskDegree.short;
      dataRisk.riskDegreeLevel = riskDegree.level;
      dataRisk.isQuantity = riskData.isQuantity;
      dataRisk.id = homogeneousGroup.gho.id;

      allRiskRecord[riskData.risk.id] = {
        ...hasRisk,
        name: `(${riskData.risk?.type}) ${riskData.risk.name}`,
        type: riskData.risk?.type,
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
