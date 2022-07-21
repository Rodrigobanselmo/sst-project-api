import { BadRequestException, Injectable } from '@nestjs/common';
import { resolve } from 'path';

import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { SendGridProvider } from '../../../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
import { InviteUserDto } from '../../../dto/invite-user.dto';
import { InviteUsersEntity } from '../../../entities/invite-users.entity';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
import { ErrorInvitesEnum } from './../../../../../shared/constants/enum/errorMessage';

@Injectable()
export class InviteUsersService {
  constructor(
    private readonly inviteUsersRepository: InviteUsersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly dateProvider: DayJSProvider,
    private readonly mailProvider: SendGridProvider,
  ) {}

  async execute(inviteUserDto: InviteUserDto) {
    const user = await this.usersRepository.findByEmail(inviteUserDto.email);

    if (user) {
      const userAlreadyAdded = user.companies.some(
        (company) => company.companyId === inviteUserDto.companyId,
      );

      if (userAlreadyAdded)
        throw new BadRequestException(ErrorInvitesEnum.USER_ALREADY_EXIST);
    }

    const expires_date = this.dateProvider.addDay(new Date(), 7);

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
  mailProvider: SendGridProvider,
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
    'inviteUser.hbs',
  );

  // Todo: add company name
  const variables = {
    company: invite.companyName,
    link: `${process.env.APP_HOST}/cadastro/?token=${invite.id}&email=${invite.email}`,
  };

  await mailProvider.sendMail({
    path: templatePath,
    subject: 'Convite para se tornar membro',
    to: invite.email,
    variables,
  });
};
