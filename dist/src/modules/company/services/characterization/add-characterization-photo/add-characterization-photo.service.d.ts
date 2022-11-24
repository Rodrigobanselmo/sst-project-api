/// <reference types="multer" />
import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { AddPhotoCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
export declare class AddCharacterizationPhotoService {
    private readonly characterizationRepository;
    private readonly characterizationPhotoRepository;
    private readonly amazonStorageProvider;
    constructor(characterizationRepository: CharacterizationRepository, characterizationPhotoRepository: CharacterizationPhotoRepository, amazonStorageProvider: AmazonStorageProvider);
    execute(addPhotoCharacterizationDto: AddPhotoCharacterizationDto, userPayloadDto: UserPayloadDto, file: Express.Multer.File): Promise<import("../../../entities/characterization.entity").CharacterizationEntity>;
    private upload;
}
