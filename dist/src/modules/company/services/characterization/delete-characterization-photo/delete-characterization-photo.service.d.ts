import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
export declare class DeleteCharacterizationPhotoService {
    private readonly characterizationRepository;
    private readonly characterizationPhotoRepository;
    private readonly amazonStorageProvider;
    constructor(characterizationRepository: CharacterizationRepository, characterizationPhotoRepository: CharacterizationPhotoRepository, amazonStorageProvider: AmazonStorageProvider);
    execute(id: string): Promise<import("../../../entities/characterization.entity").CharacterizationEntity>;
}
