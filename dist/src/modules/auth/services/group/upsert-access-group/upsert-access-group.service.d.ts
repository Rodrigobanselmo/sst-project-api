import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { UpsertAccessGroupDto } from './../../../dto/access-group.dto';
import { AuthGroupRepository } from './../../../repositories/implementations/AuthGroupRepository';
export declare class UpsertAccessGroupsService {
    private readonly authGroupRepository;
    constructor(authGroupRepository: AuthGroupRepository);
    execute(UpsertAccessGroupsDto: UpsertAccessGroupDto, user: UserPayloadDto): Promise<import("../../../entities/access-groups.entity").AccessGroupsEntity>;
}
