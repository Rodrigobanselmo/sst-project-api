import { CreateChecklistDto } from '../../../../../modules/checklist/dto/create-checklist.dto';
import { ChecklistRepository } from '../../../../../modules/checklist/repositories/implementations/ChecklistRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CreateChecklistService {
    private readonly checklistRepository;
    constructor(checklistRepository: ChecklistRepository);
    execute(createChecklistDto: CreateChecklistDto, user: UserPayloadDto): Promise<import("../../../entities/checklist.entity").ChecklistEntity>;
}
