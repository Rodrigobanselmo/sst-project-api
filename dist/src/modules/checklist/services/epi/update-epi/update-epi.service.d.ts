import { UpdateEpiDto } from '../../../dto/epi.dto';
import { EpiRepository } from '../../../repositories/implementations/EpiRepository';
export declare class UpdateEpiService {
    private readonly epiRepository;
    constructor(epiRepository: EpiRepository);
    execute(id: number, updateEpiDto: UpdateEpiDto): Promise<import("../../../entities/epi.entity").EpiEntity>;
}
