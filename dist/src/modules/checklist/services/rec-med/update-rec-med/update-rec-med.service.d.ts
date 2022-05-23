import { UpdateRecMedDto } from '../../../../../modules/checklist/dto/rec-med.dto';
import { RecMedRepository } from '../../../../../modules/checklist/repositories/implementations/RecMedRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpdateRecMedService {
    private readonly recMedRepository;
    constructor(recMedRepository: RecMedRepository);
    execute(id: string, updateRecMedDto: UpdateRecMedDto, user: UserPayloadDto): Promise<import("../../../entities/recMed.entity").RecMedEntity>;
}
