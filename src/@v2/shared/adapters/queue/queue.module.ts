import { Module } from '@nestjs/common'

import { SQSProducer } from './producer'
import { SharedTokens } from '../../constants/tokens'

@Module({
  providers: [
    {
      provide: SharedTokens.Producer,
      useClass: SQSProducer
    }
  ],
  exports: [SharedTokens.Producer]
})
export class QueueModule { }
