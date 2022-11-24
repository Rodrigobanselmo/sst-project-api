import { UpdatePhotoCharacterizationDto } from '../../../dto/characterization.dto';
import { CharacterizationPhotoRepository } from '../../../repositories/implementations/CharacterizationPhotoRepository';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
export declare class UpdateCharacterizationPhotoService {
    private readonly characterizationRepository;
    private readonly characterizationPhotoRepository;
    constructor(characterizationRepository: CharacterizationRepository, characterizationPhotoRepository: CharacterizationPhotoRepository);
    execute(id: string, updatePhotoCharacterizationDto: UpdatePhotoCharacterizationDto): Promise<import("../../../entities/characterization.entity").CharacterizationEntity>;
}
