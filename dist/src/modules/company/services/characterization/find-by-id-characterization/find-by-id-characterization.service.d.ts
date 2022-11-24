import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
export declare class FindByIdCharacterizationService {
    private readonly characterizationRepository;
    constructor(characterizationRepository: CharacterizationRepository);
    execute(id: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/characterization.entity").CharacterizationEntity>;
}
