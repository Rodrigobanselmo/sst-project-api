import { RecMedRepository } from '../../../repositories/implementations/RecMedRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class DeleteSoftRecMedService {
    private readonly recMedRepository;
    constructor(recMedRepository: RecMedRepository);
    execute(id: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/recMed.entity").RecMedEntity>;
}
