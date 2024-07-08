import { Injectable, UnauthorizedException } from "@nestjs/common";

import { UsersRepository } from "../../../../users/repositories/implementations/UsersRepository";
import { JwtTokenProvider } from "../../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider";
import { PayloadTokenDto } from "../../../dto/payload-token.dto";
import { RefreshTokensRepository } from "../../../repositories/implementations/RefreshTokensRepository";
import { instanceToInstance } from "class-transformer";

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly jwtTokenProvider: JwtTokenProvider,
  ) {}

  async execute(
    refresh_token: string,
    companyId?: string,
    options?: { isApp?: boolean },
  ) {
    const sub = this.jwtTokenProvider.verifyIsValidToken(
      refresh_token,
      "refresh",
    );

    if (sub === "expired") {
      await this.refreshTokensRepository.deleteByRefreshToken(refresh_token);
      throw new UnauthorizedException("jwt expired");
    }

    if (sub === "invalid") {
      throw new UnauthorizedException("invalid jwt");
    }

    const userId = Number(sub);

    const userRefreshToken =
      await this.refreshTokensRepository.findByUserIdAndRefreshToken(
        userId,
        refresh_token,
      );

    if (!userRefreshToken) {
      throw new UnauthorizedException("Refresh Token does not exists!");
    }

    const user = await this.usersRepository.findById(userId);

    const companies = user.companies
      .map(({ companyId, permissions, roles, status }) => {
        if (status.toUpperCase() !== "ACTIVE") return null;

        return {
          companyId,
          permissions,
          roles,
        };
      })
      .filter((i) => i);

    const company =
      companies.find((userCompany) => userCompany.companyId === companyId) ||
      companies[0] ||
      ({} as (typeof companies)[0]);

    const payloadToken: PayloadTokenDto = {
      email: user.email,
      sub: user.id,
      ...company,
    };

    const token = this.jwtTokenProvider.generateToken(payloadToken);
    const [new_refresh_token, refreshTokenExpiresDate] =
      this.jwtTokenProvider.generateRefreshToken(user.id, {
        isApp: options?.isApp,
      });

    const refreshToken = await this.refreshTokensRepository.create(
      new_refresh_token,
      user.id,
      refreshTokenExpiresDate,
    );

    await this.refreshTokensRepository.deleteById(userRefreshToken.id);

    return {
      refresh_token: refreshToken.refresh_token,
      token: token,
      user: instanceToInstance(user),
      ...company,
    };
  }
}
