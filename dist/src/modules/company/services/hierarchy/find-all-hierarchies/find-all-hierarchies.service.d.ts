import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindAllHierarchyService {
    private readonly hierarchyRepository;
    constructor(hierarchyRepository: HierarchyRepository);
    execute(user: UserPayloadDto): Promise<import("../../../entities/hierarchy.entity").HierarchyEntity[]>;
}
