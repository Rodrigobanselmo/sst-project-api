/// <reference types="multer" />
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpsertCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
export declare class UpsertCharacterizationService {
    private readonly characterizationRepository;
    private readonly characterizationPhotoRepository;
    constructor(characterizationRepository: CharacterizationRepository, characterizationPhotoRepository: CharacterizationPhotoRepository);
    execute({ photos, ...upsertCharacterizationDto }: UpsertCharacterizationDto, workspaceId: string, userPayloadDto: UserPayloadDto, files: Array<Express.Multer.File>): Promise<import("../../../entities/characterization.entity").CharacterizationEntity>;
    private upload;
}
