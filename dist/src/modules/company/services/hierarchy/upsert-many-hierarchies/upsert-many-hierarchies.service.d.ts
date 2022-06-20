import { UpdateHierarchyDto } from '../../../../../modules/company/dto/hierarchy';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpsertManyHierarchyService {
    private readonly hierarchyRepository;
    constructor(hierarchyRepository: HierarchyRepository);
    execute(hierarchies: UpdateHierarchyDto[], user: UserPayloadDto): Promise<import("../../../entities/hierarchy.entity").HierarchyEntity[]>;
}
