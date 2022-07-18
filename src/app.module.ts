import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './modules/auth/auth.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { CompanyModule } from './modules/company/company.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { FilesModule } from './modules/files/files.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { PermissionsGuard } from './shared/guards/permissions.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { FirebaseProvider } from './shared/providers/FirebaseProvider/FirebaseProvider';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    CompanyModule,
    ChecklistModule,
    FilesModule,
    DocumentsModule,
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
    FirebaseProvider,
  ],
  controllers: [],
})
export class AppModule {}
