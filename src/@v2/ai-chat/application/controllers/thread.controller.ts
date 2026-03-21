import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { AiThreadRepository } from '../../database/repositories/ai-thread.repository';
import { StreamChatUseCase } from '../use-cases/stream-chat.usecase';
import { CreateThreadDto, UpdateThreadDto, SendMessageDto, ListThreadsQueryDto, ListMessagesQueryDto } from './thread.dto';

@Controller('ai-chat/threads')
export class ThreadController {
  constructor(
    private readonly aiThreadRepository: AiThreadRepository,
    private readonly streamChatUseCase: StreamChatUseCase,
  ) {}

  @Post()
  async create(@User() user: UserPayloadDto, @Body() dto: CreateThreadDto) {
    return this.aiThreadRepository.create(user.userId, dto.title);
  }

  @Get()
  async list(@User() user: UserPayloadDto, @Query() query: ListThreadsQueryDto) {
    return this.aiThreadRepository.findByUserPaginated({
      userId: user.userId,
      first: query.first,
      after: query.after,
      search: query.search,
    });
  }

  @Get(':id')
  async findOne(@User() user: UserPayloadDto, @Param('id') id: string) {
    const thread = await this.aiThreadRepository.findById(id, user.userId);
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  @Patch(':id')
  async update(@User() user: UserPayloadDto, @Param('id') id: string, @Body() dto: UpdateThreadDto) {
    const thread = await this.aiThreadRepository.updateTitle(id, user.userId, dto.title);
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  @Delete(':id')
  async remove(@User() user: UserPayloadDto, @Param('id') id: string) {
    const deleted = await this.aiThreadRepository.delete(id, user.userId);
    if (!deleted) throw new NotFoundException('Thread not found');
    return { success: true };
  }

  @Get(':id/messages')
  async listMessages(@User() user: UserPayloadDto, @Param('id') id: string, @Query() query: ListMessagesQueryDto) {
    return this.aiThreadRepository.getMessages(id, user.userId, {
      first: query.first,
      before: query.before,
    });
  }

  @Post(':id/messages/stream')
  async sendMessageStream(
    @User() user: UserPayloadDto,
    @Param('id') threadId: string,
    @Body() dto: SendMessageDto,
    @Res() res: Response,
  ) {
    // Verify thread exists and belongs to user
    const thread = await this.aiThreadRepository.findById(threadId, user.userId);
    if (!thread) throw new NotFoundException('Thread not found');

    // Save user message (with optional file attachments)
    await this.aiThreadRepository.addMessage(threadId, 'user', dto.message, dto.fileIds);

    // Get history for AI context (excludes tool messages)
    const historyForAI = await this.aiThreadRepository.getMessagesForAIHistory(threadId, 20);
    // Remove the last message (the one we just added) from history
    const historyWithoutCurrent = historyForAI.slice(0, -1);

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    let fullResponse = '';
    const toolMessages: Array<{ id: string; toolName: string }> = [];

    try {
      for await (const event of this.streamChatUseCase.execute(user, {
        message: dto.message,
        history: historyWithoutCurrent,
        mode: dto.mode,
      })) {
        // Accumulate content for saving
        if (event.type === 'content') {
          fullResponse += event.content;
        }

        // Persist tool messages
        if (event.type === 'tool_start') {
          const toolMsg = await this.aiThreadRepository.addToolMessage(threadId, '', event.tool, 'running', event.description);
          toolMessages.push({ id: toolMsg.id, toolName: event.tool });
        }

        if (event.type === 'tool_end') {
          const pending = toolMessages.find((t) => t.toolName === event.tool);
          if (pending) {
            await this.aiThreadRepository.updateToolMessage(pending.id, event.result, event.success ? 'success' : 'error');
          }
        }

        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }

      // Save the full AI response
      if (fullResponse) {
        await this.aiThreadRepository.addMessage(threadId, 'assistant', fullResponse);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.write(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  }
}
