import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { BcryptHashAdapter } from './implementations/bcrypt-hash.adapter';

@Module({
  imports: [],
  providers: [
    {
      provide: SharedTokens.Hash,
      useClass: BcryptHashAdapter,
    },
  ],
  exports: [SharedTokens.Hash],
})
export class HashModule {}
