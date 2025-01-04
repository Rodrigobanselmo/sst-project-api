import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { ThrottlerModule } from '@nestjs/throttler';
import { DocumentModule } from './@v2/documents/document.module';
import { SharedModule } from './@v2/shared/shared.module';
import { SecurityModule } from './@v2/security/security.module';
import { EnterpriseModule } from './@v2/enterprise/enterprise.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60, limit: 10, }]),
    PrismaModule,
    UsersModule,
    AuthModule,
    CompanyModule,
    SSTModule,
    FilesModule,
    DocumentsModule,
    EsocialModule,
    NotificationModule,
    ScheduleModule.forRoot(),
    //V2
    DocumentModule,
    SecurityModule,
    SharedModule,
    EnterpriseModule,

  ],
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
