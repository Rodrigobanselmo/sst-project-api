import { FindEpiDto } from '../../../../../modules/checklist/dto/epi.dto';
import { EpiRepository } from '../../../repositories/implementations/EpiRepository';
export declare class FindEpiService {
    private readonly epiRepository;
    constructor(epiRepository: EpiRepository);
    execute({ skip, take, ...query }: FindEpiDto): Promise<{
        data: import("../../../entities/epi.entity").EpiEntity[];
        count: number;
    }>;
}
