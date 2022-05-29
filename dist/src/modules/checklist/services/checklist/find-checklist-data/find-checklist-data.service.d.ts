import { ChecklistRepository } from '../../../../../modules/checklist/repositories/implementations/ChecklistRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindChecklistDataService {
    private readonly checklistRepository;
    constructor(checklistRepository: ChecklistRepository);
    execute(checklistId: number, user: UserPayloadDto): Promise<import("../../../entities/checklist.entity").ChecklistEntity>;
}
