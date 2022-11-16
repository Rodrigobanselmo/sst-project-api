import { InviteUsersEntity } from './../../../entities/invite-users.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';

@Injectable()
export class FindByTokenService {
  constructor(private readonly inviteUsersRepository: InviteUsersRepository) {}
  async execute(token: string) {
    const invite = await this.inviteUsersRepository.findById(token, {
      include: {
        company: { select: { name: true, logoUrl: true } },
        professional: true,
      },
    });

    if (!invite?.id) throw new BadRequestException('Invite token not found');
    if ((invite as any)?.company?.name) invite.companyName = (invite as any).company.name;
    if ((invite as any)?.company?.logoUrl) invite.logo = (invite as any).company.logoUrl;

    return invite;
  }
}
