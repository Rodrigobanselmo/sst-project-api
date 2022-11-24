import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { ProfessionalResponsibleRepository } from '../../../repositories/implementations/ProfessionalResponsibleRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateProfessionalResponsibleDto } from '../../../dto/professional-responsible.dto';
export declare class CreateProfessionalResponsibleService {
    private readonly professionalResponsibleRepository;
    private readonly employeePPPHistoryRepository;
    constructor(professionalResponsibleRepository: ProfessionalResponsibleRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository);
    execute(UpsertProfessionalResponsibleDto: CreateProfessionalResponsibleDto, user: UserPayloadDto): Promise<import("../../../entities/professional-responsible.entity").ProfessionalResponsibleEntity>;
}
