import { FindCompanyGroupDto, UpsertCompanyGroupDto } from '../../dto/company-group.dto';
import { FindAvailableCompanyGroupsService } from '../../services/group/find-company-groups-group/find-company-groups-group.service';
import { UpsertCompanyGroupsService } from '../../services/group/upsert-company-group/upsert-company-group.service';
import { UserPayloadDto } from './../../../../shared/dto/user-payload.dto';
export declare class CompanyGroupController {
    private readonly upsertCompanyGroupsService;
    private readonly findAvailableCompanyGroupsService;
    constructor(upsertCompanyGroupsService: UpsertCompanyGroupsService, findAvailableCompanyGroupsService: FindAvailableCompanyGroupsService);
    find(userPayloadDto: UserPayloadDto, query: FindCompanyGroupDto): Promise<{
        data: import("../../entities/company-group.entity").CompanyGroupEntity[];
        count: number;
    }>;
    upsert(upsertAccessGroupDto: UpsertCompanyGroupDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/company-group.entity").CompanyGroupEntity>;
}
