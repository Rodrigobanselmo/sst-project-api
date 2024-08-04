import { MiddlewareConsumer, Module } from '@nestjs/common'

import { SharedTokens } from '../../constants/tokens'

import { NodeContext } from './services'
import { ContextMiddleware } from './middlewares'

@Module({
  imports: [],
  providers: [
    {
      provide: SharedTokens.Context,
      useClass: NodeContext
    }
  ],
  exports: [SharedTokens.Context]
})
export class ContextModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*')
  }
}
