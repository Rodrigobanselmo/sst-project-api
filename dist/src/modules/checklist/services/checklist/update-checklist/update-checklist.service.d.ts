import { UpdateChecklistDto } from '../../../../../modules/checklist/dto/update-checklist.dto';
import { ChecklistRepository } from '../../../../../modules/checklist/repositories/implementations/ChecklistRepository';
export declare class UpdateChecklistService {
    private readonly checklistRepository;
    constructor(checklistRepository: ChecklistRepository);
    execute(id: number, updateChecklistDto: UpdateChecklistDto): Promise<import("../../../entities/checklist.entity").ChecklistEntity>;
}
