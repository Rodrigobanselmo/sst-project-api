import { HierarchyRepository } from '../../../repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindHierarchyService {
    private readonly hierarchyRepository;
    constructor(hierarchyRepository: HierarchyRepository);
    execute(id: string, user: UserPayloadDto): Promise<import("../../../entities/hierarchy.entity").HierarchyEntity>;
}
