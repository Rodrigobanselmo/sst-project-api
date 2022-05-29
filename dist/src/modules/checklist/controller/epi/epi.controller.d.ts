import { CreateEpiDto, FindEpiDto, UpdateEpiDto } from '../../dto/epi.dto';
import { CreateEpiService } from '../../services/epi/create-epi/create-epi.service';
import { FindByCAEpiService } from '../../services/epi/find-ca-epi /find-ca-epi.service';
import { FindEpiService } from '../../services/epi/find-epi/find-epi.service';
import { UpdateEpiService } from '../../services/epi/update-epi/update-epi.service';
export declare class EpiController {
    private readonly createEpiService;
    private readonly updateEpiService;
    private readonly findByCAEpiService;
    private readonly findEpiService;
    constructor(createEpiService: CreateEpiService, updateEpiService: UpdateEpiService, findByCAEpiService: FindByCAEpiService, findEpiService: FindEpiService);
    create(createEpiDto: CreateEpiDto): Promise<import("../../entities/epi.entity").EpiEntity>;
    update(epiId: number, updateEpiDto: UpdateEpiDto): Promise<import("../../entities/epi.entity").EpiEntity>;
    findByCA(ca: string): Promise<import("../../entities/epi.entity").EpiEntity>;
    find(query: FindEpiDto): Promise<{
        data: import("../../entities/epi.entity").EpiEntity[];
        count: number;
    }>;
}
