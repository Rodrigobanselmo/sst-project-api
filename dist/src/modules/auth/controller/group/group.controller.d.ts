import { FindAccessGroupDto, UpsertAccessGroupDto } from '../../dto/access-group.dto';
import { FindAvailableAccessGroupsService } from '../../services/group/find-available-access-group/upsert-access-group.service';
import { UpsertAccessGroupsService } from '../../services/group/upsert-access-group/upsert-access-group.service';
import { UserPayloadDto } from './../../../../shared/dto/user-payload.dto';
export declare class AuthGroupController {
    private readonly findAvailableAccessGroupsService;
    private readonly upsertAccessGroupsService;
    constructor(findAvailableAccessGroupsService: FindAvailableAccessGroupsService, upsertAccessGroupsService: UpsertAccessGroupsService);
    find(userPayloadDto: UserPayloadDto, query: FindAccessGroupDto): Promise<{
        data: import("../../entities/access-groups.entity").AccessGroupsEntity[];
        count: number;
    }>;
    upsert(upsertAccessGroupDto: UpsertAccessGroupDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/access-groups.entity").AccessGroupsEntity>;
}
