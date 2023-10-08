import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { resolve } from 'path';

import { UsersRepository } from '../../../../users/repositories/implementations/UsersRepository';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { NodeMailProvider } from '../../../../../shared/providers/MailProvider/implementations/NodeMail/NodeMailProvider';
import { RefreshTokensRepository } from '../../../repositories/implementations/RefreshTokensRepository';
import { Cache } from 'cache-manager';

@Injectable()
export class SendForgotPassMailService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly mailProvider: NodeMailProvider,
    private readonly dateProvider: DayJSProvider,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async execute(email: string) {

    const cacheBlockEmailSend = await this.cacheManager.get(email)
    if (cacheBlockEmailSend) throw new BadRequestException('Espere 45 segundos para solicitar um novo email de recuperação de senha')


    this.cacheManager.set(email, true, process.env.NODE_ENV === 'development' ? 1 : 45)

    const user = await this.usersRepository.findFirstNude({ where: { email }, select: { id: true, name: true } });
    if (!user?.id) throw new BadRequestException('Usuário com esse email não existe');

    const templatePath = resolve(__dirname, '..', '..', '..', '..', '..', '..', 'templates', 'email', 'forgotPassword.hbs');

    const expires_date = this.dateProvider.addHours(new Date(), 3);

    const refresh_token = await this.refreshTokensRepository.create('reset', user.id, expires_date);

    const variables = {
      name: user?.name || '',
      link: `${process.env.APP_HOST}/login/resetar-senha?token=${refresh_token.id}`,
    };

    await this.mailProvider.sendMail({
      path: templatePath,
      subject: 'Recuperação de Senha',
      to: email,
      variables,
      sendDelevelop: true
    });
  }
}
