import { CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './modules/auth/auth.module';
import { SSTModule } from './modules/sst/sst.module';
import { CompanyModule } from './modules/company/company.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { EsocialModule } from './modules/esocial/esocial.module';
import { FilesModule } from './modules/files/files.module';
import { NotificationModule } from './modules/notifications/notifications.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { PermissionsGuard } from './shared/guards/permissions.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { LoggerMiddleware } from './shared/middlewares/logger.local.middleware';
import { HttpLoggerMiddleware } from './shared/middlewares/logger.middleware';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CompanyModule, SSTModule, FilesModule, DocumentsModule, EsocialModule, NotificationModule, ScheduleModule.forRoot()],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer.apply(HttpLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
