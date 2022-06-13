import { RecMedRepository } from '../../../repositories/implementations/RecMedRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RecMedEntity } from 'src/modules/checklist/entities/recMed.entity';
export declare class DeleteSoftRecMedService {
    private readonly recMedRepository;
    constructor(recMedRepository: RecMedRepository);
    execute(id: string, userPayloadDto: UserPayloadDto): Promise<RecMedEntity>;
}
