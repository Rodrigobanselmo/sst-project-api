import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { NestJwtAdapter } from './implementations/nest-jwt.adapter';

@Module({
  imports: [],
  providers: [
    {
      provide: SharedTokens.Jwt,
      useClass: NestJwtAdapter,
    },
  ],
  exports: [SharedTokens.Jwt],
})
export class JwtModule {}
