import { ErrorCompanyEnum } from './../../../../../shared/constants/enum/errorMessage';
import { BadRequestException, Injectable } from '@nestjs/common';
import sizeOf from 'image-size';
import { v4 } from 'uuid';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UpsertCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
import { DeleteHierarchyHomoGroupService } from '../../homoGroup/delete-hierarchy-homo-group/delete-hierarchy-homo-group.service';
import { UpdateHomoGroupService } from '../../homoGroup/update-homo-group/update-homo-group.service';

@Injectable()
export class UpsertCharacterizationService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationPhotoRepository: CharacterizationPhotoRepository, // private readonly amazonStorageProvider: any,
    private readonly amazonStorageProvider: AmazonStorageProvider,
    private readonly deleteHierarchyHomoGroupService: DeleteHierarchyHomoGroupService,
    private readonly updateHomoGroupService: UpdateHomoGroupService,
  ) {}

  async execute(
    { photos, ...upsertCharacterizationDto }: UpsertCharacterizationDto,
    workspaceId: string,
    userPayloadDto: UserPayloadDto,
    files: Array<Express.Multer.File>,
  ) {
    const companyId = userPayloadDto.targetCompanyId;
    const inactivating = upsertCharacterizationDto.status == 'INACTIVE';

    if (upsertCharacterizationDto.id) {
      const foundHomoGroup = await this.characterizationRepository.findFirstNude({
        where: {
          id: upsertCharacterizationDto.id,
          companyId,
        },
        select: {
          id: true,
          created_at: true,
          ...(inactivating && { homogeneousGroup: { select: { hierarchyOnHomogeneous: { where: { endDate: null }, take: 1, select: { id: true } } } } }),
          ...(!!upsertCharacterizationDto?.hierarchyIds?.length && {
            homogeneousGroup: {
              select: {
                hierarchyOnHomogeneous: {
                  select: { id: true, startDate: true, endDate: true, hierarchyId: true },
                  where: {
                    endDate: null,
                    hierarchy: {
                      id: { in: upsertCharacterizationDto.hierarchyIds },
                    },
                  },
                },
              },
            },
          }),
        },
      });

      if (!foundHomoGroup?.id) throw new BadRequestException(ErrorCompanyEnum.CHAR_NOT_FOUND);

      const forbidenInactivating = inactivating && foundHomoGroup.homogeneousGroup?.hierarchyOnHomogeneous[0]?.id;
      if (forbidenInactivating) {
        throw new BadRequestException(ErrorCompanyEnum.FORBIDEN_INACTIVATION);
      }

      await this.deleteHierarchyHomoGroupService.checkDeletion(foundHomoGroup.homogeneousGroup, userPayloadDto, {
        updateCheck: true,
        onlyEndPresentOk: true,
        data: { endDate: upsertCharacterizationDto.endDate, startDate: upsertCharacterizationDto.startDate },
      });

      await this.updateHomoGroupService.checkDeletion(foundHomoGroup.homogeneousGroup, userPayloadDto, {
        endDate: upsertCharacterizationDto.endDate,
        startDate: upsertCharacterizationDto.startDate,
        ids: upsertCharacterizationDto.hierarchyIds,
      });
    }

    const characterization = await this.characterizationRepository.upsert({
      ...upsertCharacterizationDto,
      companyId,
      workspaceId: workspaceId,
    });

    const urls = await this.upload(companyId, files);
    if (photos)
      await this.characterizationPhotoRepository.createMany(
        photos.map((photo, index) => ({
          companyCharacterizationId: characterization.id,
          photoUrl: urls[index][0],
          isVertical: urls[index][1],
          name: photo,
        })),
      );

    const characterizationData = await this.characterizationRepository.findById(characterization.id);

    return characterizationData;
  }

  private async upload(companyId: string, files: Array<Express.Multer.File>) {
    const urls = await Promise.all(
      files.map(async (file) => {
        const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
        const path = companyId + '/characterization/' + v4() + '.' + fileType;

        const { url } = await this.amazonStorageProvider.upload({
          file: file.buffer,
          isPublic: true,
          fileName: path,
        });

        const dimensions = sizeOf(file.buffer);
        const isVertical = dimensions.width < dimensions.height;

        return [url, isVertical] as [string, boolean];
      }),
    );

    return urls;
  }
}
