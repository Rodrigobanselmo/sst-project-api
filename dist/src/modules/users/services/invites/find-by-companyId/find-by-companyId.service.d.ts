import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
export declare class FindAllByCompanyIdService {
    private readonly inviteUsersRepository;
    constructor(inviteUsersRepository: InviteUsersRepository);
    execute(companyId: string): Promise<import("../../../entities/invite-users.entity").InviteUsersEntity[]>;
}
