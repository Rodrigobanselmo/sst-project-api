import { HierarchyTypeEnum } from '../../enum/company/hierarchy-type.enum';
import { CharacterizationTypeEnum } from '../../enum/security/characterization-type.enum';
import { HomoTypeEnum } from '../../enum/security/homo-type.enum';
import { OriginTypeEnum } from '../../enum/security/origin-type.enum';

interface IHomogeneousGroupParams {
  name: string;
  type: HomoTypeEnum | null;
  characterization: { name: string; type: CharacterizationTypeEnum } | null;
  hierarchy: { name: string; type: HierarchyTypeEnum } | null;
}

interface IOriginResponse {
  name: string;
  type: OriginTypeEnum;
}

export const getOriginHomogeneousGroup = ({ name, type, characterization, hierarchy }: IHomogeneousGroupParams): IOriginResponse => {
  const isHierarchy = type == HomoTypeEnum.HIERARCHY && hierarchy;
  if (isHierarchy)
    return {
      name: hierarchy!.name,
      type: OriginTypeEnum[hierarchy.type],
    };

  const isCharacterization = characterization;
  if (isCharacterization)
    return {
      name: characterization.name,
      type: OriginTypeEnum[characterization.type],
    };

  return { name, type: OriginTypeEnum.HOMOGENEOUS_GROUP };
};
