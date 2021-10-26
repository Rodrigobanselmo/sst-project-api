import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { classToClass } from 'class-transformer';
import { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';

import { HashProvider } from '../../../../shared/providers/HashProvider/implementations/HashProvider';
import { JwtTokenProvider } from '../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { LoginUserDto } from '../../dto/login-user.dto';
import { PayloadTokenDto } from '../../dto/payload-token.dto';
import { RefreshTokensRepository } from '../../repositories/implementations/RefreshTokensRepository';

@Injectable()
export class SessionService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly hashProvider: HashProvider,
    private readonly jwtTokenProvider: JwtTokenProvider,
  ) {}

  async execute({ email, password }: LoginUserDto) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await this.hashProvider.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException('Email or password incorrect');
    }

    const payload: PayloadTokenDto = {
      email,
      sub: user.id,
      roles: user.roles,
      permissions: user.permissions,
    };

    const token = this.jwtTokenProvider.generateToken(payload);

    const [refresh_token, refreshTokenExpiresDate] =
      this.jwtTokenProvider.generateRefreshToken(user.id);

    const newRefreshToken = await this.refreshTokensRepository.create(
      refresh_token,
      user.id,
      refreshTokenExpiresDate,
    );

    return {
      token,
      refresh_token: newRefreshToken.refresh_token,
      user: classToClass(user),
    };
  }
}
