import { Paragraph, Table } from 'docx';

import { HFullWidthImage } from '../../../base/elements/imagesLayout/hFullWidthImage';
import { HTwoImages } from '../../../base/elements/imagesLayout/hTwoImages';
import { ImageDivider } from '../../../base/elements/imagesLayout/imageDivider';
import { VFullWidthImage } from '../../../base/elements/imagesLayout/vFullWidthImage';
import { VHImages } from '../../../base/elements/imagesLayout/vHImages';
import { VThreeImages } from '../../../base/elements/imagesLayout/vThreeImages';
import { VTwoImages } from '../../../base/elements/imagesLayout/vTwoImages';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { EnvironmentPhotoEntity } from './../../../../../company/entities/environment-photo.entity';
import { EnvironmentEntity } from './../../../../../company/entities/environment.entity';

export const environmentsConverter = (
  environments: EnvironmentEntity[],
): { variables: IDocVariables; elements: ReturnType<typeof getLayouts> }[] => {
  return environments.map((environment) => {
    const imagesVertical = environment.photos.filter(
      (image) => image.isVertical,
    );

    const imagesHorizontal = environment.photos.filter(
      (image) => !image.isVertical,
    );

    const elements = getLayouts(imagesVertical, imagesHorizontal);
    const variables = {
      [VariablesPGREnum.ENVIRONMENT_NAME]: environment.name || '',
      [VariablesPGREnum.ENVIRONMENT_DESCRIPTION]: environment.description || '',
      [VariablesPGREnum.ENVIRONMENT_NOISE]: environment.noiseValue || '',
      [VariablesPGREnum.ENVIRONMENT_TEMPERATURE]: environment.temperature || '',
      [VariablesPGREnum.ENVIRONMENT_MOISTURE]:
        environment.moisturePercentage || '',
    };

    return { elements, variables };
  });
};

const getLayouts = (
  vPhotos: EnvironmentPhotoEntity[],
  hPhotos: EnvironmentPhotoEntity[],
) => {
  const vLength = vPhotos.length;
  const hLength = hPhotos.length;

  const isAllLegendEqual = [...vPhotos, ...hPhotos].every(
    (photo) => vPhotos[0] && photo.name === vPhotos[0].name,
  );

  const layouts: (Table[] | Paragraph[])[] = [];

  const vLayout = (vPhotos: EnvironmentPhotoEntity[], length: number) => {
    const hasDivider = layouts.length > 0;

    if (hasDivider) layouts.push([ImageDivider()]);

    if (length >= 3 && length - 3 !== 1) {
      const removeLegend =
        isAllLegendEqual && (length - 3 !== 0 || hLength !== 0);

      layouts.push(
        VThreeImages(
          [vPhotos[0].photoUrl, vPhotos[1].photoUrl, vPhotos[2].photoUrl],
          [vPhotos[0].name, vPhotos[1].name, vPhotos[2].name],
          removeLegend,
        ),
      );

      const restOfPhotos = vPhotos.slice(3);
      return vLayout(restOfPhotos, restOfPhotos.length);
    }

    if (length >= 2) {
      const removeLegend =
        isAllLegendEqual && (length - 2 !== 0 || hLength !== 0);
      layouts.push(
        VTwoImages(
          [vPhotos[0].photoUrl, vPhotos[1].photoUrl],
          [vPhotos[0].name, vPhotos[1].name],
          removeLegend,
        ),
      );

      const restOfPhotos = vPhotos.slice(2);
      return vLayout(restOfPhotos, restOfPhotos.length);
    }

    return vPhotos;
  };

  const hLayout = (
    hPhotos: EnvironmentPhotoEntity[],
    vPhotos: EnvironmentPhotoEntity[],
    hLength: number,
  ) => {
    const hasDivider = layouts.length > 0;

    if (hasDivider) layouts.push([ImageDivider()]);

    if (vPhotos.length >= 1) {
      const removeLegend = isAllLegendEqual && hLength > 1;

      if (hLength == 0) {
        layouts.push(VFullWidthImage(vPhotos[0].photoUrl, vPhotos[0].name));
        return;
      }

      if (hLength > 0) {
        layouts.push(
          VHImages(
            [vPhotos[0].photoUrl, hPhotos[0].photoUrl],
            [vPhotos[0].name, hPhotos[0].name],
            removeLegend,
          ),
        );

        const restOfPhotos = hPhotos.slice(1);
        return hLayout(restOfPhotos, [], restOfPhotos.length);
      }

      const restOfPhotos = hPhotos.slice(3);
      return hLayout(restOfPhotos, [], restOfPhotos.length);
    }

    if (hLength >= 2) {
      const removeLegend = isAllLegendEqual && hLength - 2 !== 0;
      layouts.push(
        HTwoImages(
          [hPhotos[0].photoUrl, hPhotos[1].photoUrl],
          [hPhotos[0].name, hPhotos[1].name],
          removeLegend,
        ),
      );

      const restOfPhotos = hPhotos.slice(2);
      return hLayout(restOfPhotos, [], restOfPhotos.length);
    }

    if (hPhotos[0])
      layouts.push(HFullWidthImage(hPhotos[0].photoUrl, hPhotos[0].name));
  };

  const restOfVPhotos = vLayout(vPhotos, vLength);
  hLayout(hPhotos, restOfVPhotos, hLength);

  return layouts.reduce((acc, layout) => [...acc, ...layout], []);
};