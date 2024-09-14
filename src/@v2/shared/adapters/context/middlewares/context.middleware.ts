import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

import { asyncLocalStorage } from '../lib'
import { ContextKey } from '../types/enum/context-key.enum'

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    asyncLocalStorage.run(
      {
        [ContextKey.IP]: String(req.headers['x-forwarded-for'] || req.socket.remoteAddress)
      },
      () => {
        next()
      }
    )
  }
}
