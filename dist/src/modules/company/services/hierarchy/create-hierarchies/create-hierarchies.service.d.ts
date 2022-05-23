import { CreateHierarchyDto } from '../../../../../modules/company/dto/hierarchy';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CreateHierarchyService {
    private readonly hierarchyRepository;
    constructor(hierarchyRepository: HierarchyRepository);
    execute(hierarchy: CreateHierarchyDto, user: UserPayloadDto): Promise<import("../../../entities/hierarchy.entity").HierarchyEntity>;
}
