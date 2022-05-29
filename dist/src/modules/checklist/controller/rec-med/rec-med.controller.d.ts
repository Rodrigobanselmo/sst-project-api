import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateRecMedService } from '../../services/rec-med/create-rec-med/create-rec-med.service';
import { CreateRecMedDto, UpdateRecMedDto } from '../../dto/rec-med.dto';
import { UpdateRecMedService } from '../../services/rec-med/update-rec-med/update-rec-med.service';
export declare class RecMedController {
    private readonly createRecMedService;
    private readonly updateRecMedService;
    constructor(createRecMedService: CreateRecMedService, updateRecMedService: UpdateRecMedService);
    create(userPayloadDto: UserPayloadDto, createRecMedDto: CreateRecMedDto): Promise<import("../../entities/recMed.entity").RecMedEntity>;
    update(recMedId: string, userPayloadDto: UserPayloadDto, updateRiskDto: UpdateRecMedDto): Promise<import("../../entities/recMed.entity").RecMedEntity>;
}
