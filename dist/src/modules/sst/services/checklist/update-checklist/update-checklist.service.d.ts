import { UpdateChecklistDto } from '../../../dto/update-checklist.dto';
import { ChecklistRepository } from '../../../repositories/implementations/ChecklistRepository';
export declare class UpdateChecklistService {
    private readonly checklistRepository;
    constructor(checklistRepository: ChecklistRepository);
    execute(id: number, updateChecklistDto: UpdateChecklistDto): Promise<import("../../../entities/checklist.entity").ChecklistEntity>;
}
