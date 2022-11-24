import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { FindAccessGroupDto } from '../../../dto/access-group.dto';
import { AuthGroupRepository } from '../../../repositories/implementations/AuthGroupRepository';
export declare class FindAvailableAccessGroupsService {
    private readonly authGroupRepository;
    constructor(authGroupRepository: AuthGroupRepository);
    execute({ skip, take, ...query }: FindAccessGroupDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/access-groups.entity").AccessGroupsEntity[];
        count: number;
    }>;
}
