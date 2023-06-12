import { UserEntity } from '../../../../users/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { classToClass } from 'class-transformer';

import { UsersRepository } from '../../../../users/repositories/implementations/UsersRepository';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { JwtTokenProvider } from '../../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { LoginUserDto } from '../../../dto/login-user.dto';
import { PayloadTokenDto } from '../../../dto/payload-token.dto';
import { RefreshTokensRepository } from '../../../repositories/implementations/RefreshTokensRepository';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { FirebaseProvider } from '../../../../../shared/providers/FirebaseProvider/FirebaseProvider';

@Injectable()
export class SessionService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly hashProvider: HashProvider,
    private readonly jwtTokenProvider: JwtTokenProvider,
    private readonly firebaseProvider: FirebaseProvider
  ) { }

  async execute({ email, password, userEntity }: LoginUserDto & { userEntity?: UserEntity }) {
    const user = userEntity ? userEntity : await this.validateUser(email, password);

    const companies = user.companies
      .map(({ companyId, permissions, roles, status }) => {
        if (status.toUpperCase() !== 'ACTIVE') return null;

        return {
          companyId,
          permissions,
          roles,
        };
      })
      .filter((i) => i);

    const company = companies[0] || ({} as typeof companies[0]);

    const payload: PayloadTokenDto = {
      email,
      sub: user.id,
      ...company,
    };

    const token = this.jwtTokenProvider.generateToken(payload);

    const [refresh_token, refreshTokenExpiresDate] = this.jwtTokenProvider.generateRefreshToken(user.id);

    const newRefreshToken = await this.refreshTokensRepository.create(refresh_token, user.id, refreshTokenExpiresDate);

    return {
      token,
      refresh_token: newRefreshToken.refresh_token,
      user: classToClass(user),
      ...company,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user?.id) {
      throw new BadRequestException(ErrorMessageEnum.WRONG_EMAIL_PASS);
    }

    const passwordMatch = await this.hashProvider.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException(ErrorMessageEnum.WRONG_EMAIL_PASS);
    }

    return user;
  }
}
