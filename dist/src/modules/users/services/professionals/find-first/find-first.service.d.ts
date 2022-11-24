import { FindProfessionalsDto } from '../../../dto/professional.dto';
import { ProfessionalRepository } from '../../../repositories/implementations/ProfessionalRepository';
export declare class FindFirstProfessionalService {
    private readonly professionalRepository;
    constructor(professionalRepository: ProfessionalRepository);
    execute({ councilId, councilType, councilUF, cpf, email }: FindProfessionalsDto): Promise<import("../../../entities/professional.entity").ProfessionalEntity>;
}
