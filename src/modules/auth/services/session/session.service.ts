import { BadRequestException, Injectable } from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';

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
    const user = await this.validateUser(email, password);
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
      user: instanceToInstance(user),
      ...company,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Email or password incorrect');
    }

    const passwordMatch = await this.hashProvider.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException('Email or password incorrect');
    }

    return user;
  }
}
