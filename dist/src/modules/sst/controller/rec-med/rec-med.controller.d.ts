import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateRecMedDto, UpdateRecMedDto } from '../../dto/rec-med.dto';
import { CreateRecMedService } from '../../services/rec-med/create-rec-med/create-rec-med.service';
import { DeleteSoftRecMedService } from '../../services/rec-med/delete-soft-rec-med/delete-soft-rec-med.service';
import { UpdateRecMedService } from '../../services/rec-med/update-rec-med/update-rec-med.service';
export declare class RecMedController {
    private readonly createRecMedService;
    private readonly updateRecMedService;
    private readonly deleteSoftRecMedService;
    constructor(createRecMedService: CreateRecMedService, updateRecMedService: UpdateRecMedService, deleteSoftRecMedService: DeleteSoftRecMedService);
    create(userPayloadDto: UserPayloadDto, createRecMedDto: CreateRecMedDto): Promise<import("../../entities/recMed.entity").RecMedEntity>;
    update(recMedId: string, userPayloadDto: UserPayloadDto, updateRiskDto: UpdateRecMedDto): Promise<import("../../entities/recMed.entity").RecMedEntity>;
    deleteSoft(recMedId: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/recMed.entity").RecMedEntity>;
}
