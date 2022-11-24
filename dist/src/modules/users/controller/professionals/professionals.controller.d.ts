import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateProfessionalDto, FindProfessionalsDto, UpdateProfessionalDto } from '../../dto/professional.dto';
import { CreateProfessionalService } from '../../services/professionals/create-professional/create-professional.service';
import { FindAllProfessionalsByCompanyService } from '../../services/professionals/find-all/find-all.service';
import { FindFirstProfessionalService } from '../../services/professionals/find-first/find-first.service';
import { UpdateProfessionalService } from '../../services/professionals/update-professional/update-professional.service';
export declare class ProfessionalsController {
    private readonly findAllByCompanyService;
    private readonly createProfessionalService;
    private readonly updateProfessionalService;
    private readonly findFirstProfessionalService;
    constructor(findAllByCompanyService: FindAllProfessionalsByCompanyService, createProfessionalService: CreateProfessionalService, updateProfessionalService: UpdateProfessionalService, findFirstProfessionalService: FindFirstProfessionalService);
    findAllByCompany(userPayloadDto: UserPayloadDto, query: FindProfessionalsDto): Promise<{
        data: import("../../entities/professional.entity").ProfessionalEntity[];
        count: number;
    }>;
    findFirst(query: FindProfessionalsDto): Promise<import("../../entities/professional.entity").ProfessionalEntity>;
    create(createProfessionalDto: CreateProfessionalDto, user: UserPayloadDto): Promise<import("../../entities/professional.entity").ProfessionalEntity>;
    update(updateProfessionalDto: UpdateProfessionalDto, user: UserPayloadDto, id: number): Promise<import("../../entities/professional.entity").ProfessionalEntity>;
}
