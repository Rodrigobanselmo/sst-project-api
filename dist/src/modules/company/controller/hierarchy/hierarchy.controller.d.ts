import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateHierarchyDto, UpdateHierarchyDto, UpsertManyHierarchyDto } from '../../dto/hierarchy';
import { CreateHierarchyService } from '../../services/hierarchy/create-hierarchies/create-hierarchies.service';
import { DeleteHierarchyService } from '../../services/hierarchy/delete-hierarchies/delete-hierarchies.service';
import { FindAllHierarchyService } from '../../services/hierarchy/find-all-hierarchies/find-all-hierarchies.service';
import { UpdateHierarchyService } from '../../services/hierarchy/update-hierarchies/update-hierarchies.service';
import { UpsertManyHierarchyService } from '../../services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service';
export declare class HierarchyController {
    private readonly findAllHierarchyService;
    private readonly createHierarchyService;
    private readonly updateHierarchyService;
    private readonly upsertManyHierarchyService;
    private readonly deleteHierarchyService;
    constructor(findAllHierarchyService: FindAllHierarchyService, createHierarchyService: CreateHierarchyService, updateHierarchyService: UpdateHierarchyService, upsertManyHierarchyService: UpsertManyHierarchyService, deleteHierarchyService: DeleteHierarchyService);
    findAllAvailable(userPayloadDto: UserPayloadDto): Promise<import("../../entities/hierarchy.entity").HierarchyEntity[]>;
    create(createHierarchyDto: CreateHierarchyDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/hierarchy.entity").HierarchyEntity>;
    update(updateHierarchyDto: UpdateHierarchyDto, id: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/hierarchy.entity").HierarchyEntity>;
    upsertMany(upsertManyHierarchyDto: UpsertManyHierarchyDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/hierarchy.entity").HierarchyEntity[]>;
    delete(id: string, userPayloadDto: UserPayloadDto): Promise<void>;
}
