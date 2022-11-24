import { FindProfessionalsDto } from './../../../dto/professional.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ProfessionalRepository } from './../../../repositories/implementations/ProfessionalRepository';
export declare class FindAllProfessionalsByCompanyService {
    private readonly professionalRepository;
    constructor(professionalRepository: ProfessionalRepository);
    execute({ skip, take, ...query }: FindProfessionalsDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/professional.entity").ProfessionalEntity[];
        count: number;
    }>;
}
