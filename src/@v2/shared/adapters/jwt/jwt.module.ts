import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { NestJwtAdapter } from './implementations/nest-jwt.adapter';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    NestJwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRES,
      },
    }),
  ],
  providers: [
    {
      provide: SharedTokens.Jwt,
      useClass: NestJwtAdapter,
    },
  ],
  exports: [SharedTokens.Jwt],
})
export class JwtModule {}
