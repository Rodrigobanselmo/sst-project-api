import { Module } from '@nestjs/common';
import { UsersModule } from '../../modules/users/users.module';
import { SharedModule } from '../shared/shared.module';
import { ThreadController } from './application/controllers/thread.controller';
import { FileController } from './application/controllers/file.controller';
import { TranscribeController } from './application/controllers/transcribe.controller';
import { StreamChatUseCase } from './application/use-cases/stream-chat.usecase';
import { LlmFactory } from './domain/llm/llm.factory';
import { AiThreadRepository } from './database/repositories/ai-thread.repository';
import { AiFileRepository } from './database/repositories/ai-file.repository';

@Module({
  imports: [UsersModule, SharedModule],
  controllers: [ThreadController, FileController, TranscribeController],
  providers: [StreamChatUseCase, LlmFactory, AiThreadRepository, AiFileRepository],
})
export class AiChatModule {}
