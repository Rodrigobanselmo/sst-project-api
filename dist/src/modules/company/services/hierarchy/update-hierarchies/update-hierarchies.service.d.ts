import { UpdateHierarchyDto } from '../../../../../modules/company/dto/hierarchy';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpdateHierarchyService {
    private readonly hierarchyRepository;
    constructor(hierarchyRepository: HierarchyRepository);
    execute(hierarchy: UpdateHierarchyDto, user: UserPayloadDto): Promise<import("../../../entities/hierarchy.entity").HierarchyEntity>;
}
