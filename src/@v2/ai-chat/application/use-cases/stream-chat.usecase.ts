import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import { LlmFactory } from '../../domain/llm/llm.factory';
import type { AIMode } from '../../domain/llm/llm.factory';
import { streamSupervisorAgent } from '../../domain/agents/supervisor-agent';
import type { StreamEvent } from '../../domain/types/stream-events';
import type { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

export interface StreamChatInput {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  mode?: AIMode;
}

@Injectable()
export class StreamChatUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly llmFactory: LlmFactory,
  ) {}

  async *execute(user: UserPayloadDto, input: StreamChatInput): AsyncGenerator<StreamEvent, void, undefined> {
    const companyId = user.targetCompanyId ?? user.companyId;
    const llm = this.llmFactory.create({ mode: input.mode });

    for await (const event of streamSupervisorAgent({
      message: input.message,
      history: input.history,
      companyId,
      usersRepository: this.usersRepository,
      llm,
    })) {
      yield event;
    }
  }
}
