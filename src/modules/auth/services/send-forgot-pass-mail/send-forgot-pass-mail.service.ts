import { BadRequestException, Injectable } from '@nestjs/common';
import { resolve } from 'path';

import { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { EtherealMailProvider } from '../../../../shared/providers/MailProvider/implementations/Ethereal/EtherealMailProvider';
import { RefreshTokensRepository } from '../../repositories/implementations/RefreshTokensRepository';

@Injectable()
export class SendForgotPassMailService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly mailProvider: EtherealMailProvider,
    private readonly dateProvider: DayJSProvider,
  ) {}

  async execute(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User does not exists');
    }

    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'templates',
      'email',
      'ForgotPassword.hbs',
    );

    const expires_date = this.dateProvider.addHours(new Date(), 3);

    const refresh_token = await this.refreshTokensRepository.create(
      'reset',
      user.id,
      expires_date,
    );

    const variables = {
      name: 'user.name',
      link: `${process.env.APP_HOST}/password/reset?token=${refresh_token.id}`,
    };

    // console.log('variables', variables);
    // console.log('email', email);
    // console.log('templatePath', templatePath);

    await this.mailProvider.sendMail({
      path: templatePath,
      subject: 'Recuperação de Senha',
      to: email,
      variables,
    });
  }
}