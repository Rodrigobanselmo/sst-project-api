import { BadRequestException, Injectable } from '@nestjs/common';
import { readFile, writeFile, unlink } from 'fs/promises';
import { v4 } from 'uuid';

import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { convert3gpToMp3 } from '../../../../../shared/utils/convert3gpToMp3';
import { AddFileCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationFileRepository } from '../../../repositories/implementations/CharacterizationFileRepository';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class AddCharacterizationFileService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationFileRepository: CharacterizationFileRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(addFileCharacterizationDto: AddFileCharacterizationDto, userPayloadDto: UserPayloadDto, file: Express.Multer.File) {
    const fileUrl = await this.upload(file);

    if (addFileCharacterizationDto.id) {
      const foundFile = await this.characterizationFileRepository.findById(addFileCharacterizationDto.id);

      if (foundFile?.id) {
        throw new BadRequestException(ErrorCompanyEnum.FILE_ALREADY_EXISTS);
      }
    }

    await this.characterizationFileRepository.upsert({
      ...addFileCharacterizationDto,
      url: fileUrl,
      companyCharacterizationId: addFileCharacterizationDto.companyCharacterizationId,
    });

    const characterizationData = await this.characterizationRepository.findById(addFileCharacterizationDto.companyCharacterizationId);

    return characterizationData;
  }

  public async upload(file: Express.Multer.File, opt?: { id?: string }) {
    const fileBuffer = await this.convertFileBuffer(file);

    const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const path = 'characterization/files/' + (opt?.id || v4()) + '.' + fileType;

    const { url } = await this.amazonStorageProvider.upload({
      file: fileBuffer,
      isPublic: true,
      fileName: path,
    });

    return url;
  }

  private async convertFileBuffer(file: Express.Multer.File) {
    if (!file?.originalname) return file.buffer;
    if (file.originalname.split('.').pop() !== '3gp') return file.buffer;

    const outputPath = 'tmp/' + v4() + '.mp3';
    const inputPath = 'tmp/' + v4() + '.3gp';

    file.originalname = file.originalname.replace('.3gp', '.mp3');

    try {
      await writeFile(inputPath, file.buffer as any);
    } catch (err) {
      throw new Error(`Erro ao salvar arquivo 3gp: ${JSON.stringify(err)}`);
    }

    try {
      await convert3gpToMp3(inputPath, outputPath);
      const fileBuffer = await readFile(outputPath);

      try {
        await unlink(inputPath);
      } catch (err) {}
      try {
        await unlink(outputPath);
      } catch (err) {}

      return fileBuffer;
    } catch (err) {
      try {
        await unlink(inputPath);
      } catch (err) {}
      try {
        await unlink(outputPath);
      } catch (err) {}

      throw new Error(`Erro ao converter arquivo mp3: ${JSON.stringify(err)}`);
    }
  }
}
