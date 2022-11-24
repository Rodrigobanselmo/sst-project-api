import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { UpdateProfessionalResponsibleDto } from './../../../dto/professional-responsible.dto';
import { ProfessionalResponsibleRepository } from './../../../repositories/implementations/ProfessionalResponsibleRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpdateProfessionalResponsibleService {
    private readonly professionalCouncilResponsibleRepository;
    private readonly employeePPPHistoryRepository;
    constructor(professionalCouncilResponsibleRepository: ProfessionalResponsibleRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository);
    execute(UpsertProfessionalCouncilResponsibleDto: UpdateProfessionalResponsibleDto, user: UserPayloadDto): Promise<import("../../../entities/professional-responsible.entity").ProfessionalResponsibleEntity>;
}
