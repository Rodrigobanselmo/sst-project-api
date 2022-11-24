import { ChecklistRepository } from '../../../repositories/implementations/ChecklistRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindAvailableChecklistService {
    private readonly checklistRepository;
    constructor(checklistRepository: ChecklistRepository);
    execute(user: UserPayloadDto): Promise<import("../../../entities/checklist.entity").ChecklistEntity[]>;
}
