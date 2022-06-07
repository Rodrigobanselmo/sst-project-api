import { CreateRecMedDto } from '../../../../../modules/checklist/dto/rec-med.dto';
import { RecMedRepository } from '../../../../../modules/checklist/repositories/implementations/RecMedRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CreateRecMedService {
    private readonly recMedRepository;
    constructor(recMedRepository: RecMedRepository);
    execute(createRecMedDto: CreateRecMedDto, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/recMed.entity").RecMedEntity>;
}
