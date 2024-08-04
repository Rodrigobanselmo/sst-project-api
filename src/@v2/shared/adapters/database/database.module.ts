import { Module } from '@nestjs/common'

import { PrismaServiceV2 } from './prisma.service'

@Module({
  providers: [PrismaServiceV2],
  exports: [PrismaServiceV2]
})
export class DatabaseModule { }
