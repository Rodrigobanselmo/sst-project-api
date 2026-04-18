import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, NotFoundException } from '@nestjs/common';
import { S3StorageAdapter } from '@/@v2/shared/adapters/storage/s3.storage.adapter';
import { Response } from 'express';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { AiThreadRepository, type AiFileAttachment } from '../../database/repositories/ai-thread.repository';
import { AiFileRepository } from '../../database/repositories/ai-file.repository';
import { StreamChatUseCase } from '../use-cases/stream-chat.usecase';
import { CreateThreadDto, UpdateThreadDto, SendMessageDto, ListThreadsQueryDto, ListMessagesQueryDto } from './thread.dto';
import { extractAndPersistForMessage, type FileAttachment, type ExtractionResult } from '../../domain/file-processing';

@Controller('ai-chat/threads')
export class ThreadController {
  constructor(
    private readonly aiThreadRepository: AiThreadRepository,
    private readonly aiFileRepository: AiFileRepository,
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
    const result = await this.aiThreadRepository.getMessages(id, user.userId, {
      first: query.first,
      before: query.before,
    });

    // Generate presigned URLs for file attachments
    const s3 = new S3StorageAdapter();
    for (const edge of result.edges) {
      if (edge.node.attachments && edge.node.attachments.length > 0) {
        for (const att of edge.node.attachments) {
          try {
            (att as any).url = await s3.generateSignedPath({ fileKey: att.key, expires: 3600, bucket: att.bucket });
          } catch {
            (att as any).url = null;
          }
        }
      }
    }

    return result;
  }

  @Post(':id/messages/stream')
  async sendMessageStream(@User() user: UserPayloadDto, @Param('id') threadId: string, @Body() dto: SendMessageDto, @Res() res: Response) {
    // Verify thread exists and belongs to user
    const thread = await this.aiThreadRepository.findById(threadId, user.userId);
    if (!thread) throw new NotFoundException('Thread not found');

    // Save user message (with optional file attachments)
    const savedMessage = await this.aiThreadRepository.addMessage(threadId, 'user', dto.message, dto.fileIds);

    // Fetch file details and extract content for the current message's attachments
    let attachmentsForAgent: FileAttachment[] | undefined;
    let extractedContents: Map<string, ExtractionResult> | undefined;

    if (dto.fileIds && dto.fileIds.length > 0) {
      const files = await this.aiFileRepository.findByIds(dto.fileIds);
      attachmentsForAgent = files.map((f) => ({
        key: f.key,
        bucket: f.bucket,
        region: f.region,
        filename: f.filename,
        mimeType: f.mimeType,
        fileId: f.id,
      }));

      // Extract and persist file content (results passed to supervisor to avoid double S3 download)
      if (savedMessage.attachments && savedMessage.attachments.length > 0) {
        extractedContents = await extractAndPersistForMessage(
          savedMessage.attachments.map((att) => ({
            id: att.id,
            fileId: att.fileId,
            key: att.key,
            bucket: att.bucket,
            region: att.region,
            mimeType: att.mimeType,
            filename: att.filename,
          })),
        );
      }
    }

    // Get history for AI context (excludes tool messages, includes file attachments with cached extractions)
    const historyForAI = await this.aiThreadRepository.getMessagesForAIHistory(threadId, 20);
    // Remove the last message (the one we just added) from history
    const historyWithoutCurrent = historyForAI.slice(0, -1);

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Send keep-alive comments every 15 seconds to prevent connection timeout
    const keepAliveInterval = setInterval(() => {
      try {
        res.write(': keep-alive\n\n');
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
      } catch {
        // Connection closed, clear interval
        clearInterval(keepAliveInterval);
      }
    }, 15000);

    // Create assistant message BEFORE agent loop (with empty content)
    // This allows tools to reference the messageId during execution
    const assistantMessage = await this.aiThreadRepository.addMessage(threadId, 'assistant', '');

    let fullResponse = '';
    const toolMessages: Array<{ id: string; toolName: string }> = [];
    let eventCount = 0;
    let lastEventType = '';

    try {
      console.log(`[StreamChat] Starting stream for thread ${threadId}, message: "${dto.message.substring(0, 50)}..."`);

      for await (const event of this.streamChatUseCase.execute(user, {
        message: dto.message,
        history: historyWithoutCurrent,
        attachments: attachmentsForAgent,
        mode: dto.mode,
        extractedContents,
        pageContext: dto.pageContext,
        threadId, // Pass threadId so tools can access it
        assistantMessageId: assistantMessage.id, // Pass messageId for tools
      })) {
        eventCount++;
        lastEventType = event.type;

        // Accumulate content for saving
        if (event.type === 'content') {
          fullResponse += event.content;
        }

        // Send SSE event to client BEFORE persisting to DB (so UI updates immediately)
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }

        // Persist tool messages to DB (fire after SSE write)
        if (event.type === 'tool_start') {
          const toolMsg = await this.aiThreadRepository.addToolMessage(threadId, event.description, event.tool, 'running', event.description);
          toolMessages.push({ id: toolMsg.id, toolName: event.tool });
        }

        if (event.type === 'tool_end') {
          const pending = toolMessages.find((t) => t.toolName === event.tool);
          if (pending) {
            const content = event.success ? '\u2713' : `\u2717 ${event.result}`;
            await this.aiThreadRepository.updateToolMessage(pending.id, content, event.success ? 'success' : 'error');
          }
        }
      }

      console.log(`[StreamChat] Stream completed. Events: ${eventCount}, Last event: ${lastEventType}, Response length: ${fullResponse.length}`);

      // Update the assistant message with the full response
      if (fullResponse) {
        await this.aiThreadRepository.updateMessage(assistantMessage.id, fullResponse);
      } else {
        // If no response, delete the empty message
        console.warn(`[StreamChat] No response generated for thread ${threadId}`);
        await this.aiThreadRepository.deleteMessage(assistantMessage.id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[StreamChat] Error in stream:`, error);
      res.write(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`);

      // Still try to save partial response if we got any
      if (fullResponse) {
        console.log(`[StreamChat] Saving partial response (${fullResponse.length} chars) after error`);
        await this.aiThreadRepository.updateMessage(assistantMessage.id, fullResponse);
      }
    } finally {
      // Clear keep-alive interval when done
      clearInterval(keepAliveInterval);
      console.log(`[StreamChat] Stream ended for thread ${threadId}`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  }
}
