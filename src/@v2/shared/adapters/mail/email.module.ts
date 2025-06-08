import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { QueueModule } from '../queue/queue.module';
import { QueueMailerAdapter } from './queue-mailer.adapter';

@Module({
  imports: [QueueModule],
  providers: [
    {
      provide: SharedTokens.Email,
      useClass: QueueMailerAdapter,
    },
  ],
  exports: [SharedTokens.Email],
})
export class EmailModule {}
