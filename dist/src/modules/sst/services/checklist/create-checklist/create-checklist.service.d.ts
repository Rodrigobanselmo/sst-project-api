import { CreateChecklistDto } from '../../../dto/create-checklist.dto';
import { ChecklistRepository } from '../../../repositories/implementations/ChecklistRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CreateChecklistService {
    private readonly checklistRepository;
    constructor(checklistRepository: ChecklistRepository);
    execute(createChecklistDto: CreateChecklistDto, user: UserPayloadDto): Promise<import("../../../entities/checklist.entity").ChecklistEntity>;
}
