import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { CompanyCharacterization, CompanyCharacterizationPhoto } from '@prisma/client';
import { CharacterizationPhotoModel } from '../../domain/models/characterization-photos.model';
import { CharacterizationModel } from '../../domain/models/characterization.model';
import { isDevelopmentGetter } from '@/@v2/shared/utils/helpers/is-development';

export type ICharacterizationMapper = CompanyCharacterization & {
  photos: CompanyCharacterizationPhoto[];
};

export class CharacterizationMapper {
  static toModel(data: ICharacterizationMapper): CharacterizationModel {
    const isDevelopment = isDevelopmentGetter();

    return new CharacterizationModel({
      id: data.id,
      name: data.name,
      description: data.description,
      type: CharacterizationTypeEnum[data.type],
      profileName: data.profileName,
      profileParentId: data.profileParentId,
      temperature: data.temperature,
      noiseValue: data.noiseValue,
      luminosity: data.luminosity,
      moisturePercentage: data.moisturePercentage,
      activities: data.activities,
      paragraphs: data.paragraphs,
      considerations: data.considerations,

      photos: !isDevelopment
        ? data.photos.map(
            (photo) =>
              new CharacterizationPhotoModel({
                isVertical: photo.isVertical,
                name: photo.name,
                url: photo.photoUrl,
              }),
          )
        : [],
    });
  }
}
