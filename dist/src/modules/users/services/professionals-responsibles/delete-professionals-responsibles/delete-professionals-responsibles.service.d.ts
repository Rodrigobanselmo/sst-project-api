import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { ProfessionalResponsibleRepository } from './../../../repositories/implementations/ProfessionalResponsibleRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class DeleteProfessionalResponsibleService {
    private readonly professionalResponsibleRepository;
    private readonly employeePPPHistoryRepository;
    constructor(professionalResponsibleRepository: ProfessionalResponsibleRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository);
    execute(id: number, user: UserPayloadDto): Promise<import("../../../entities/professional-responsible.entity").ProfessionalResponsibleEntity>;
}
