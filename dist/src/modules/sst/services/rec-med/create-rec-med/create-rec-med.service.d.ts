import { CreateRecMedDto } from '../../../dto/rec-med.dto';
import { RecMedRepository } from '../../../repositories/implementations/RecMedRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CreateRecMedService {
    private readonly recMedRepository;
    constructor(recMedRepository: RecMedRepository);
    execute(createRecMedDto: CreateRecMedDto, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/recMed.entity").RecMedEntity>;
}
