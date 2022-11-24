import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateSimpleHierarchyDto } from '../../../dto/hierarchy';
import { HierarchyRepository } from '../../../repositories/implementations/HierarchyRepository';
export declare class UpdateSimpleManyHierarchyService {
    private readonly hierarchyRepository;
    constructor(hierarchyRepository: HierarchyRepository);
    execute(hierarchies: UpdateSimpleHierarchyDto[], user: UserPayloadDto): Promise<import("../../../entities/hierarchy.entity").HierarchyEntity[]>;
}
