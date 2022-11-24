import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
export declare class FindAllCharacterizationService {
    private readonly characterizationRepository;
    constructor(characterizationRepository: CharacterizationRepository);
    execute(workspaceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/characterization.entity").CharacterizationEntity[]>;
}
