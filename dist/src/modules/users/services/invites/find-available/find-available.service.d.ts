import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { FindInvitesDto } from './../../../dto/invite-user.dto';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
export declare class FindAvailableService {
    private readonly inviteUsersRepository;
    constructor(inviteUsersRepository: InviteUsersRepository);
    execute({ skip, take, ...query }: FindInvitesDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/invite-users.entity").InviteUsersEntity[];
        count: number;
    }>;
}
