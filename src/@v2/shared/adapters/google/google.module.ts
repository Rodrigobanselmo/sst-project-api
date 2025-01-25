import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { FirebaseGoogleAdapter } from './firebase-google.adapter';

@Module({
  imports: [],
  providers: [
    {
      provide: SharedTokens.Google,
      useClass: FirebaseGoogleAdapter,
    },
  ],
  exports: [SharedTokens.Google],
})
export class GoogleModule {}
