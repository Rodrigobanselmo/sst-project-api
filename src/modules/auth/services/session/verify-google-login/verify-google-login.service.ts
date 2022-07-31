import { ErrorInvitesEnum } from '../../../../../shared/constants/enum/errorMessage';
import { BadRequestException, Injectable } from '@nestjs/common';

import { FirebaseProvider } from '../../../../../shared/providers/FirebaseProvider/FirebaseProvider';
import { UsersRepository } from '../../../../users/repositories/implementations/UsersRepository';
import { LoginGoogleUserDto } from '../../../dto/login-user.dto';

@Injectable()
export class VerifyGoogleLoginService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly firebaseProvider: FirebaseProvider,
  ) {}

  async execute({ token }: LoginGoogleUserDto) {
    try {
      const result = await this.firebaseProvider.validateGoogleToken(token);
      const user = await this.usersRepository.findByGoogleExternalId(
        result.user.uid,
      );

      if (!user?.id) {
        throw new BadRequestException(ErrorInvitesEnum.GOOGLE_USER_NOT_EXIST);
      }

      return user;
    } catch (error) {
      throw new BadRequestException(ErrorInvitesEnum.GOOGLE_USER_NOT_EXIST);
    }
  }
}
