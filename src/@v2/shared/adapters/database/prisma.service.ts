import { INestApplication, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'


@Injectable()
export class PrismaServiceV2 extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close()
    })
  }

  async onApplicationShutdown() {
    await this.$disconnect()
  }
}
