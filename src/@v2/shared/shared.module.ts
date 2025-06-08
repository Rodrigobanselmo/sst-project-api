import { Module } from '@nestjs/common';

import { ContextModule } from './adapters/context/context.module';
import { DatabaseModule } from './adapters/database/database.module';
import { QueueModule } from './adapters/queue/queue.module';
import { RequesterFactory } from './adapters/requester';
import { StorageModule } from './adapters/storage/storage.module';
import { SharedTokens } from './constants/tokens';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { EmailModule } from './adapters/mail/email.module';
import { JwtModule } from './adapters/jwt/jwt.module';
import { HashModule } from './adapters/hash/hash.module';
import { GoogleModule } from './adapters/google/google.module';
import { FileRequesterModule } from './requesters/files/file.module';
import { NotificationModule } from './adapters/notification/notification.module';

@Module({
  imports: [DatabaseModule, ContextModule, StorageModule, QueueModule, EmailModule, JwtModule, HashModule, GoogleModule, FileRequesterModule, NotificationModule],
  providers: [
    JwtStrategy,
    {
      provide: SharedTokens.GenericRequester,
      useFactory: () => RequesterFactory.create(),
    },
  ],
  exports: [
    SharedTokens.GenericRequester,
    DatabaseModule,
    StorageModule,
    ContextModule,
    QueueModule,
    EmailModule,
    JwtModule,
    JwtStrategy,
    HashModule,
    GoogleModule,
    FileRequesterModule,
    NotificationModule,
  ],
})
export class SharedModule {}
