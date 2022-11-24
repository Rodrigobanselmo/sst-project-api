import { EpiRepository } from '../../../repositories/implementations/EpiRepository';
export declare class FindByCAEpiService {
    private readonly epiRepository;
    constructor(epiRepository: EpiRepository);
    execute(ca: string): Promise<import("../../../entities/epi.entity").EpiEntity>;
}
