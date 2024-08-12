import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { S3StorageAdapter } from './s3.storage.adapter';


@Module({
  imports: [],
  providers: [
    {
      provide: SharedTokens.Storage,
      useClass: S3StorageAdapter
    }
  ],
  exports: [SharedTokens.Storage]
})
export class StorageModule { }
