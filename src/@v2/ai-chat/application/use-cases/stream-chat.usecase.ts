import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import { PrismaServiceV2 } from '../../../shared/adapters/database/prisma.service';
import { LlmFactory } from '../../domain/llm/llm.factory';
import type { AIMode } from '../../domain/llm/llm.factory';
import { streamSupervisorAgent } from '../../domain/agents/supervisor-agent';
import type { StreamEvent } from '../../domain/types/stream-events';
import type { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import type { AiFileAttachment } from '../../database/repositories/ai-thread.repository';
import type { FileAttachment, ExtractionResult } from '../../domain/file-processing';

export interface PageContext {
  companyId?: string;
  path?: string;
  homogeneousGroupId?: string;
}

export interface StreamChatInput {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string; attachments?: AiFileAttachment[] }>;
  attachments?: FileAttachment[];
  mode?: AIMode;
  /** Pre-extracted file contents from controller (avoids double S3 download) */
  extractedContents?: Map<string, ExtractionResult>;
  /** Page context from frontend (URL params, current page info) */
  pageContext?: PageContext;
}

@Injectable()
export class StreamChatUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly llmFactory: LlmFactory,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async *execute(user: UserPayloadDto, input: StreamChatInput): AsyncGenerator<StreamEvent, void, undefined> {
    const llm = this.llmFactory.create({ mode: input.mode });

    for await (const event of streamSupervisorAgent({
      message: input.message,
      history: input.history,
      attachments: input.attachments,
      prisma: this.prisma,
      llm,
      user,
      extractedContents: input.extractedContents,
      pageContext: input.pageContext,
      //!
      usersRepository: this.usersRepository, // deprecated
    })) {
      yield event;
    }
  }
}
