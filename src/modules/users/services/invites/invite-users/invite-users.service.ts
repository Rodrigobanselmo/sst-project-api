import { BadRequestException, Injectable } from '@nestjs/common';
import { resolve } from 'path';

import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { AwsSesProvider } from '../../../../../shared/providers/MailProvider/implementations/AwsSes/AwsSesProvider';
import { InviteUserDto } from '../../../dto/invite-user.dto';
import { InviteUsersEntity } from '../../../entities/invite-users.entity';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';

@Injectable()
export class InviteUsersService {
  constructor(
    private readonly inviteUsersRepository: InviteUsersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly dateProvider: DayJSProvider,
    private readonly mailProvider: AwsSesProvider,
  ) {}

  async execute(inviteUserDto: InviteUserDto) {
    const user = await this.usersRepository.findByEmail(inviteUserDto.email);

    if (user) {
      const userAlreadyAdded = user.companies.some(
        (company) => company.companyId === inviteUserDto.companyId,
      );

      if (userAlreadyAdded) throw new BadRequestException('User already added');
    }

    const expires_date = this.dateProvider.addHours(new Date(), 3);

    await this.inviteUsersRepository.deleteByCompanyIdAndEmail(
      inviteUserDto.companyId,
      inviteUserDto.email,
    );

    const invite = await this.inviteUsersRepository.create(
      inviteUserDto,
      expires_date,
    );

    await inviteNewUser(this.mailProvider, invite);

    return invite;
  }
}

const inviteNewUser = async (
  mailProvider: AwsSesProvider,
  invite: InviteUsersEntity,
) => {
  const templatePath = resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    '..',
    'templates',
    'email',
    'InviteUser.hbs',
  );

  // Todo: add company name
  const variables = {
    company: invite.companyId,
    link: `${process.env.APP_HOST}/invites/?token=${invite.id}`,
  };

  await mailProvider.sendMail({
    path: templatePath,
    subject: 'Convite para se tornar membro',
    to: invite.email,
    variables,
  });
};
