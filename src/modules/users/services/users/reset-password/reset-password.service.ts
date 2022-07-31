import { ErrorInvitesEnum } from './../../../../../shared/constants/enum/errorMessage';
import { Injectable, BadRequestException } from '@nestjs/common';
import { RefreshTokensRepository } from '../../../../auth/repositories/implementations/RefreshTokensRepository';

import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { ResetPasswordDto } from '../../../dto/reset-pass';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute({ tokenId, password }: ResetPasswordDto) {
    const refresh_token = await this.refreshTokensRepository.findById(tokenId);

    if (!refresh_token?.id)
      throw new BadRequestException(ErrorInvitesEnum.TOKEN_NOT_FOUND);

    const passHash = await this.hashProvider.createHash(password);

    const user = await this.userRepository.update(refresh_token.userId, {
      password: passHash,
    });

    delete user.password;
    return user;
  }
}
