import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CopyHomogeneousGroupDto, CreateHomoGroupDto, FindHomogeneousGroupDto, UpdateHierarchyHomoGroupDto, UpdateHomoGroupDto } from '../../dto/homoGroup';
import { CopyHomoGroupService } from '../../services/homoGroup/copy-homo-group/copy-homo-group.service';
import { CreateHomoGroupService } from '../../services/homoGroup/create-homo-group/create-homo-group.service';
import { DeleteHomoGroupService } from '../../services/homoGroup/delete-homo-group/delete-homo-group.service';
import { FindByCompanyHomoGroupService } from '../../services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service';
import { FindHomogenousGroupByIdService } from '../../services/homoGroup/find-homo-group-by-id/find-homo-group-by-id.service';
import { FindHomogenousGroupService } from '../../services/homoGroup/find-homo-group/find-homo-group.service';
import { UpdateHierarchyHomoGroupService } from '../../services/homoGroup/update-hierarchy-homo-group/update-hierarchy-homo-group.service';
import { UpdateHomoGroupService } from '../../services/homoGroup/update-homo-group/update-homo-group.service';
export declare class HomoGroupsController {
    private readonly findByCompanyHomoGroupService;
    private readonly findHomogenousGroupService;
    private readonly findHomogenousGroupByIdService;
    private readonly createHomoGroupsService;
    private readonly updateHomoGroupsService;
    private readonly deleteHomoGroupsService;
    private readonly copyHomoGroupService;
    private readonly updateHierarchyHomoGroupService;
    constructor(findByCompanyHomoGroupService: FindByCompanyHomoGroupService, findHomogenousGroupService: FindHomogenousGroupService, findHomogenousGroupByIdService: FindHomogenousGroupByIdService, createHomoGroupsService: CreateHomoGroupService, updateHomoGroupsService: UpdateHomoGroupService, deleteHomoGroupsService: DeleteHomoGroupService, copyHomoGroupService: CopyHomoGroupService, updateHierarchyHomoGroupService: UpdateHierarchyHomoGroupService);
    find(query: FindHomogeneousGroupDto, userPayloadDto: UserPayloadDto): Promise<{
        data: import("../../entities/homoGroup.entity").HomoGroupEntity[];
        count: number;
    }>;
    findByCompany(userPayloadDto: UserPayloadDto): Promise<import("../../entities/homoGroup.entity").HomoGroupEntity[]>;
    findById(id: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/homoGroup.entity").HomoGroupEntity>;
    updateHierarchyHomo(updateHomoGroupsDto: UpdateHierarchyHomoGroupDto, userPayloadDto: UserPayloadDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    create(createHomoGroupsDto: CreateHomoGroupDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/homoGroup.entity").HomoGroupEntity>;
    update(updateHomoGroupsDto: UpdateHomoGroupDto, id: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/homoGroup.entity").HomoGroupEntity>;
    delete(id: string, userPayloadDto: UserPayloadDto): Promise<void>;
    copy(createHomoGroupsDto: CopyHomogeneousGroupDto, userPayloadDto: UserPayloadDto): Promise<void>;
}
