import { ErrorInvitesEnum } from './../../../../../shared/constants/enum/errorMessage';
import { Injectable, BadRequestException } from '@nestjs/common';

import { UsersRepository } from '../../../repositories/implementations/UsersRepository';

@Injectable()
export class FindByEmailService {
  constructor(private readonly userRepository: UsersRepository) {}
  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user?.id)
      throw new BadRequestException(
        ErrorInvitesEnum.EMAIL_NOT_FOUND.replace(':v1', email),
      );
    delete user.password;
    return user;
  }
}
