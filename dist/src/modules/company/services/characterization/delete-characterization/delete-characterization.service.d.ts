import { HomoGroupRepository } from './../../../repositories/implementations/HomoGroupRepository';
import { CharacterizationPhotoRepository } from './../../../repositories/implementations/CharacterizationPhotoRepository';
import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
export declare class DeleteCharacterizationService {
    private readonly characterizationRepository;
    private readonly characterizationPhotoRepository;
    private readonly amazonStorageProvider;
    private readonly homoGroupRepository;
    constructor(characterizationRepository: CharacterizationRepository, characterizationPhotoRepository: CharacterizationPhotoRepository, amazonStorageProvider: AmazonStorageProvider, homoGroupRepository: HomoGroupRepository);
    execute(id: string, workspaceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/characterization.entity").CharacterizationEntity>;
}
