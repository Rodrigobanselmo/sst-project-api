import { Module } from '@nestjs/common'


import { ContextModule } from './adapters/context/context.module'
import { DatabaseModule } from './adapters/database/database.module'
import { SharedTokens } from './constants/tokens'
import { RequesterFactory } from './adapters/requester'


@Module({
  imports: [
    DatabaseModule,
    ContextModule,
  ],
  providers: [
    {
      provide: SharedTokens.GenericRequester,
      useFactory: () => RequesterFactory.create()
    }
  ],
  exports: [
    SharedTokens.GenericRequester,
    DatabaseModule,
    ContextModule,
  ]
})
export class SharedModule { }
