import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { NodeMailerAdapter } from './node-mailer.adapter.ts';

@Module({
  imports: [],
  providers: [
    {
      provide: SharedTokens.Email,
      useClass: NodeMailerAdapter,
    },
  ],
  exports: [SharedTokens.Email],
})
export class EmailModule {}
