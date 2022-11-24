import { ProfessionalResponsibleRepository } from '../../../repositories/implementations/ProfessionalResponsibleRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindProfessionalResponsibleDto } from '../../../../../modules/users/dto/professional-responsible.dto';
export declare class FindProfessionalResponsibleService {
    private readonly professionalResponsibleRepository;
    constructor(professionalResponsibleRepository: ProfessionalResponsibleRepository);
    execute({ skip, take, ...query }: FindProfessionalResponsibleDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/professional-responsible.entity").ProfessionalResponsibleEntity[];
        count: number;
    }>;
}
