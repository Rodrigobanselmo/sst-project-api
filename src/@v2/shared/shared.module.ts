import { Module } from '@nestjs/common'


import { ContextModule } from './adapters/context/context.module'
import { DatabaseModule } from './adapters/database/database.module'
import { QueueModule } from './adapters/queue/queue.module'
import { RequesterFactory } from './adapters/requester'
import { StorageModule } from './adapters/storage/storage.module'
import { SharedTokens } from './constants/tokens'
import { JwtStrategy } from './strategies/jwt/jwt.strategy'


@Module({
  imports: [
    DatabaseModule,
    ContextModule,
    StorageModule,
    QueueModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: SharedTokens.GenericRequester,
      useFactory: () => RequesterFactory.create()
    },
  ],
  exports: [
    SharedTokens.GenericRequester,
    DatabaseModule,
    StorageModule,
    ContextModule,
    QueueModule,
  ]
})
export class SharedModule { }
