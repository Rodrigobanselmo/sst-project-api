import { FileModule } from '@/@v2/files/file.module';
import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { ImportFileRequester } from './import.file.requester';

@Module({
  imports: [FileModule],
  providers: [
    {
      provide: SharedTokens.FileRequester,
      useClass: ImportFileRequester,
    },
  ],
  exports: [SharedTokens.FileRequester],
})
export class FileRequesterModule {}
