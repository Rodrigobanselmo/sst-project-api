import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateHomoGroupDto, UpdateHomoGroupDto } from '../../dto/homoGroup';
import { CreateHomoGroupService } from '../../services/homoGroup/create-homo-group/create-homo-group.service';
import { DeleteHomoGroupService } from '../../services/homoGroup/delete-homo-group/delete-homo-group.service';
import { FindByCompanyHomoGroupService } from '../../services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service';
import { UpdateHomoGroupService } from '../../services/homoGroup/update-homo-group/update-homo-group.service';
export declare class HomoGroupsController {
    private readonly findByCompanyHomoGroupService;
    private readonly createHomoGroupsService;
    private readonly updateHomoGroupsService;
    private readonly deleteHomoGroupsService;
    constructor(findByCompanyHomoGroupService: FindByCompanyHomoGroupService, createHomoGroupsService: CreateHomoGroupService, updateHomoGroupsService: UpdateHomoGroupService, deleteHomoGroupsService: DeleteHomoGroupService);
    findByCompany(userPayloadDto: UserPayloadDto): Promise<import("../../entities/homoGroup.entity").HomoGroupEntity[]>;
    create(createHomoGroupsDto: CreateHomoGroupDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/homoGroup.entity").HomoGroupEntity>;
    update(updateHomoGroupsDto: UpdateHomoGroupDto, id: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/homoGroup.entity").HomoGroupEntity>;
    delete(id: string, userPayloadDto: UserPayloadDto): Promise<void>;
}
