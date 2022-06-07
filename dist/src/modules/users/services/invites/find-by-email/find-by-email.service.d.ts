import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
export declare class FindAllByEmailService {
    private readonly inviteUsersRepository;
    constructor(inviteUsersRepository: InviteUsersRepository);
    execute(email: string): Promise<import("../../../entities/invite-users.entity").InviteUsersEntity[]>;
}
