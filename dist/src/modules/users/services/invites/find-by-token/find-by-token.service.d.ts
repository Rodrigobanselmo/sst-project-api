import { InviteUsersEntity } from './../../../entities/invite-users.entity';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
export declare class FindByTokenService {
    private readonly inviteUsersRepository;
    constructor(inviteUsersRepository: InviteUsersRepository);
    execute(token: string): Promise<InviteUsersEntity>;
}
