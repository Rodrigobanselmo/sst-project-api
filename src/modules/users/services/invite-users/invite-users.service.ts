import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { DayJSProvider } from 'src/shared/providers/DateProvider/implementations/DayJSProvider';
import { EtherealMailProvider } from 'src/shared/providers/MailProvider/implementations/Ethereal/EtherealMailProvider';
import { InviteUserDto } from '../../dto/invite-user.dto';
import { InviteUsersEntity } from '../../entities/invite-users.entity';
import { InviteUsersRepository } from '../../repositories/implementations/InviteUsersRepository';

@Injectable()
export class InviteUsersService {
  constructor(
    private readonly inviteUsersRepository: InviteUsersRepository,
    private readonly dateProvider: DayJSProvider,
    private readonly mailProvider: EtherealMailProvider,
  ) {}

  async execute(inviteUserDto: InviteUserDto) {
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
  mailProvider: EtherealMailProvider,
  invite: InviteUsersEntity,
) => {
  const templatePath = resolve(
    __dirname,
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

  // console.log('variables', variables);
  // console.log('email', invite.email);
  // console.log('templatePath', templatePath);

  await mailProvider.sendMail({
    path: templatePath,
    subject: 'Convite para se tornar membro',
    to: invite.email,
    variables,
  });
};
