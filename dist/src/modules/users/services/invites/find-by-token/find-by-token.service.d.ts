import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
export declare class FindByTokenService {
    private readonly inviteUsersRepository;
    constructor(inviteUsersRepository: InviteUsersRepository);
    execute(token: string): Promise<import("../../../entities/invite-users.entity").InviteUsersEntity>;
}
