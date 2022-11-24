import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateProfessionalResponsibleDto, FindProfessionalResponsibleDto, UpdateProfessionalResponsibleDto } from '../../dto/professional-responsible.dto';
import { CreateProfessionalResponsibleService } from '../../services/professionals-responsibles/create-professionals-responsibles/create-professional-responsiblea.service';
import { DeleteProfessionalResponsibleService } from '../../services/professionals-responsibles/delete-professionals-responsibles/delete-professionals-responsibles.service';
import { FindProfessionalResponsibleService } from '../../services/professionals-responsibles/find-professionals-responsibles/find-professionals-responsibles.service';
import { UpdateProfessionalResponsibleService } from '../../services/professionals-responsibles/update-professionals-responsibles/update-professionals-responsibles.service';
export declare class ProfessionalResponsibleController {
    private readonly updateProfessionalResponsibleService;
    private readonly createProfessionalResponsibleService;
    private readonly findAvailableProfessionalResponsibleService;
    private readonly deleteProfessionalResponsibleService;
    constructor(updateProfessionalResponsibleService: UpdateProfessionalResponsibleService, createProfessionalResponsibleService: CreateProfessionalResponsibleService, findAvailableProfessionalResponsibleService: FindProfessionalResponsibleService, deleteProfessionalResponsibleService: DeleteProfessionalResponsibleService);
    find(userPayloadDto: UserPayloadDto, query: FindProfessionalResponsibleDto): Promise<{
        data: import("../../entities/professional-responsible.entity").ProfessionalResponsibleEntity[];
        count: number;
    }>;
    create(upsertAccessGroupDto: CreateProfessionalResponsibleDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/professional-responsible.entity").ProfessionalResponsibleEntity>;
    update(upsertAccessGroupDto: UpdateProfessionalResponsibleDto, userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/professional-responsible.entity").ProfessionalResponsibleEntity>;
    delete(userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/professional-responsible.entity").ProfessionalResponsibleEntity>;
}
