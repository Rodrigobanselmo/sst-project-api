import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../../modules/users/users.module';
import { SharedModule } from '../shared/shared.module';
import { SSTModule } from '../../modules/sst/sst.module';
import { ThreadController } from './application/controllers/thread.controller';
import { FileController } from './application/controllers/file.controller';
import { TranscribeController } from './application/controllers/transcribe.controller';
import { ActionController } from './application/controllers/action.controller';
import { StreamChatUseCase } from './application/use-cases/stream-chat.usecase';
import { ConfirmActionUseCase } from './application/use-cases/confirm-action.usecase';
import { LlmFactory } from './domain/llm/llm.factory';
import { AiThreadRepository } from './database/repositories/ai-thread.repository';
import { AiFileRepository } from './database/repositories/ai-file.repository';
import { AiPendingActionRepository } from './database/repositories/ai-pending-action.repository';

@Module({
  imports: [UsersModule, SharedModule, forwardRef(() => SSTModule)],
  controllers: [ThreadController, FileController, TranscribeController, ActionController],
  providers: [StreamChatUseCase, ConfirmActionUseCase, LlmFactory, AiThreadRepository, AiFileRepository, AiPendingActionRepository],
})
export class AiChatModule {}
