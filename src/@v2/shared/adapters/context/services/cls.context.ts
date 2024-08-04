import { Injectable } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'

import { LocalContext } from './context.interface'

@Injectable()
export class ClsContext implements LocalContext {
  constructor(private readonly cls: ClsService) { }

  set<T>(key: string, value: T): void {
    this.cls.set(key, value)
  }

  get<T>(key: string): T {
    return this.cls.get(key)
  }
}
