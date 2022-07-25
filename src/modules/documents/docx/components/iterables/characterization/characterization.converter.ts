import { sortNumber } from './../../../../../../shared/utils/sorts/number.sort';
import { RiskFactorsEntity } from '../../../../../checklist/entities/risk.entity';
import { CharacterizationEntity } from '../../../../../company/entities/characterization.entity';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { CharacterizationTypeEnum } from '@prisma/client';
import { getLayouts } from '../environments/environments.converter';

export const characterizationsConverter = (
  characterizations: CharacterizationEntity[],
): {
  variables: IDocVariables;
  elements: ReturnType<typeof getLayouts>;
  risks: RiskFactorsEntity[];
  considerations: string[];
  activities: string[];
  breakPage: boolean;
  type: CharacterizationTypeEnum;
  id: string;
}[] => {
  return characterizations
    .sort((a, b) => sortNumber(a, b, 'order'))
    .map((characterization) => {
      const imagesVertical = characterization.photos.filter(
        (image) => image.isVertical,
      );

      const imagesHorizontal = characterization.photos.filter(
        (image) => !image.isVertical,
      );

      const breakPage =
        imagesVertical.length > 0 || imagesHorizontal.length > 0;

      const elements = getLayouts(imagesVertical, imagesHorizontal);
      const variables = {
        [VariablesPGREnum.CHARACTERIZATION_NAME]: characterization.name || '',
        [VariablesPGREnum.CHARACTERIZATION_DESC]:
          characterization.description || '',
        [VariablesPGREnum.CHARACTERIZATION_NOISE]:
          characterization.noiseValue || '',
        [VariablesPGREnum.CHARACTERIZATION_TEMPERATURE]:
          characterization.temperature || '',
        [VariablesPGREnum.CHARACTERIZATION_LUMINOSITY]:
          characterization.luminosity || '',
        [VariablesPGREnum.CHARACTERIZATION_MOISTURE]:
          characterization.moisturePercentage || '',
      };

      const risks = characterization.homogeneousGroup.riskFactorData.map(
        (risk) => risk.riskFactor,
      );

      const considerations = characterization.considerations;
      const type = characterization.type;
      const id = characterization.id;
      const activities = characterization.activities;

      return {
        elements,
        variables,
        risks,
        considerations,
        breakPage,
        type,
        id,
        activities,
      };
    });
};
