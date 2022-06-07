import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateChecklistDto } from '../../dto/create-checklist.dto';
import { UpdateChecklistDto } from '../../dto/update-checklist.dto';
import { CreateChecklistService } from '../../services/checklist/create-checklist/create-checklist.service';
import { FindAvailableChecklistService } from '../../services/checklist/find-available-checklist/find-available-checklist.service';
import { FindChecklistDataService } from '../../services/checklist/find-checklist-data/find-checklist-data.service';
import { UpdateChecklistService } from '../../services/checklist/update-checklist/update-checklist.service';
export declare class ChecklistController {
    private readonly createChecklistService;
    private readonly findAvailableChecklistService;
    private readonly findChecklistDataService;
    private readonly updateChecklistService;
    constructor(createChecklistService: CreateChecklistService, findAvailableChecklistService: FindAvailableChecklistService, findChecklistDataService: FindChecklistDataService, updateChecklistService: UpdateChecklistService);
    create(userPayloadDto: UserPayloadDto, createChecklistDto: CreateChecklistDto): Promise<import("../../entities/checklist.entity").ChecklistEntity>;
    findAllAvailable(userPayloadDto: UserPayloadDto): Promise<import("../../entities/checklist.entity").ChecklistEntity[]>;
    findChecklistData(checklistId: number, userPayloadDto: UserPayloadDto): Promise<import("../../entities/checklist.entity").ChecklistEntity>;
    update(checklistId: number, updateChecklistDto: UpdateChecklistDto): Promise<import("../../entities/checklist.entity").ChecklistEntity>;
}
