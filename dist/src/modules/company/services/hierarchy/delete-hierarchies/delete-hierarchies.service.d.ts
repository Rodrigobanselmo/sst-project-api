import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class DeleteHierarchyService {
    private readonly hierarchyRepository;
    constructor(hierarchyRepository: HierarchyRepository);
    execute(id: string, user: UserPayloadDto): Promise<void>;
}
