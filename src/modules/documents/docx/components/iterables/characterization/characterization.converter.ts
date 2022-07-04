import { RiskFactorsEntity } from '../../../../../checklist/entities/risk.entity';
import { CharacterizationEntity } from '../../../../../company/entities/characterization.entity';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { getLayouts } from '../environments/environments.converter';

export const characterizationsConverter = (
  characterizations: CharacterizationEntity[],
): {
  variables: IDocVariables;
  elements: ReturnType<typeof getLayouts>;
  risks: RiskFactorsEntity[];
  considerations: string[];
}[] => {
  return characterizations.map((characterization: any) => {
    const imagesVertical = characterization.photos.filter(
      (image) => image.isVertical,
    );

    const imagesHorizontal = characterization.photos.filter(
      (image) => !image.isVertical,
    );

    const elements = getLayouts(imagesVertical, imagesHorizontal);
    const variables = {
      [VariablesPGREnum.CHARACTERIZATION_NAME]: characterization.name || '',
      [VariablesPGREnum.CHARACTERIZATION_DESC]:
        characterization.description || '',
    };

    const risks = characterization.homogeneousGroup.riskFactorData.map(
      (risk) => risk.riskFactor,
    );

    const considerations = characterization.considerations;

    return { elements, variables, risks, considerations };
  });
};
