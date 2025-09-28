import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { AesCryptoAdapter } from './implementations/aes-crypto.adapter';

@Module({
  imports: [],
  providers: [
    {
      provide: SharedTokens.Crypto,
      useClass: AesCryptoAdapter,
    },
  ],
  exports: [SharedTokens.Crypto],
})
export class CryptoModule {}
