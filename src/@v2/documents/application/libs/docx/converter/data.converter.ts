import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { hierarchyConverter, IHierarchyDataConverter } from './hierarchy.converter';

type IDocumentClassType = {
  data: DocumentPGRModel;
};

export function dataConverter({ data }: IDocumentClassType) {
  const homoMap = data.homogeneousGroupsMap;

  const hierarchiesData = data.hierarchies
    .map((hierarchy) => ({
      ...hierarchy,
      ...(hierarchy.groups?.length && {
        hierarchyOnHomogeneous: hierarchy.groups.map((hh) => {
          const homogeneousGroup = homoMap[hh.homogeneousGroupId]!;

          return { ...hh, homogeneousGroup };
        }),
      }),
    }))
    .map((hierarchy) => {
      const hierarchyCopy = { ...hierarchy } as unknown as IHierarchyDataConverter;
      hierarchyCopy.homogeneousGroups = hierarchy.hierarchyOnHomogeneous?.map((homo) => homo.homogeneousGroup) || [];

      return hierarchyCopy;
    });

  const { hierarchyData, hierarchyHighLevelsData, homoGroupTree, hierarchyTree, riskGroupData } = hierarchyConverter(
    hierarchiesData,
    data.homogeneousGroups,
    data.documentBase.workspace,
    data.documentBase.company,
    'isPGR'
  );

  return {
    hierarchyData,
    hierarchyHighLevelsData,
    homoGroupTree,
    hierarchyTree,
    riskGroupData,
    documentRiskData: {
      riskGroupData,
      documentVersion: data.documentVersion
    }
  }
}
