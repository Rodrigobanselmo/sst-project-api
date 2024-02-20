import sizeOf from 'image-size';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { v4 } from 'uuid';

import { CharacterizationFileRepository } from '../../../repositories/implementations/CharacterizationFileRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { AddFileCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
import { ErrorCompanyEnum } from 'src/shared/constants/enum/errorMessage';

@Injectable()
export class AddCharacterizationFileService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationFileRepository: CharacterizationFileRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) { }

  async execute(addFileCharacterizationDto: AddFileCharacterizationDto, userPayloadDto: UserPayloadDto, file: Express.Multer.File) {
    const fileUrl = await this.upload(file);

    console.log(fileUrl)

    if (addFileCharacterizationDto.id) {
      const foundFile = await this.characterizationFileRepository.findById(addFileCharacterizationDto.id);

      if (foundFile?.id) {
        throw new BadRequestException(ErrorCompanyEnum.FILE_ALREADY_EXISTS);
      }
    }


    await this.characterizationFileRepository.upsert(
      {
        ...addFileCharacterizationDto,
        url: fileUrl,
        companyCharacterizationId: addFileCharacterizationDto.companyCharacterizationId,
      },
    );

    const characterizationData = await this.characterizationRepository.findById(addFileCharacterizationDto.companyCharacterizationId);

    return characterizationData;
  }

  public async upload(file: Express.Multer.File, opt?: { id?: string }) {
    const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const path = 'characterization/files/' + (opt?.id || v4()) + '.' + fileType;

    const { url } = await this.amazonStorageProvider.upload({
      file: file.buffer,
      isPublic: true,
      fileName: path,
    });

    return url
  }
}
