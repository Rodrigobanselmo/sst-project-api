import { CreateEpiDto } from '../../../dto/epi.dto';
import { EpiRepository } from '../../../repositories/implementations/EpiRepository';
export declare class CreateEpiService {
    private readonly epiRepository;
    constructor(epiRepository: EpiRepository);
    execute(createEpiDto: CreateEpiDto): Promise<import("../../../entities/epi.entity").EpiEntity>;
}
