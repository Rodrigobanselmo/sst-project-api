import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserContext } from '@/@v2/shared/adapters/context'
import { JWTType } from './jwt.type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-v2') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET,
    })
  }

  async validate({ sub: userId, permissions }: JWTType): Promise<UserContext> {
    const userContext = new UserContext({
      user: {
        id: Number(userId),
        permissions,
      },
    })

    return userContext
  }
}
