import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import type { AiMessageRoleEnum } from '@prisma/client';

// ─── Interfaces ──────────────────────────────────────────────

export interface AIThread {
  id: string;
  title: string;
  userId: number;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiFileAttachment {
  id: string;
  fileId: string;
  filename: string;
  mimeType: string;
  size: number;
  key: string;
  bucket: string;
  region: string;
  extractedContent?: string | null;
  extractionType?: string | null;
}

export interface AIMessage {
  id: string;
  threadId: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolName?: string | null;
  toolStatus?: string | null;
  toolDescription?: string | null;
  createdAt: Date;
  attachments?: AiFileAttachment[];
}

export interface AIThreadConnection {
  edges: Array<{ cursor: string; node: AIThread }>;
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  totalCount: number;
}

export interface AIMessageConnection {
  edges: Array<{ cursor: string; node: AIMessage }>;
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  totalCount: number;
}

// ─── Repository ──────────────────────────────────────────────

@Injectable()
export class AiThreadRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async create(userId: number, title?: string): Promise<AIThread> {
    const thread = await this.prisma.aiThread.create({
      data: {
        userId,
        title: title ?? 'Novo Chat',
      },
    });

    return this.mapThread(thread);
  }

  async findById(threadId: string, userId: number): Promise<AIThread | null> {
    const thread = await this.prisma.aiThread.findFirst({
      where: { id: threadId, userId, deleted_at: null },
    });

    return thread ? this.mapThread(thread) : null;
  }

  async findByUserPaginated(options: { userId: number; first?: number; after?: string | null; search?: string | null }): Promise<AIThreadConnection> {
    const { userId, first = 20, after, search } = options;

    const where: any = {
      userId,
      deleted_at: null,
      lastMessageAt: { not: null },
    };

    if (search?.trim()) {
      where.title = { contains: search.trim(), mode: 'insensitive' };
    }

    const [totalCount, threads] = await Promise.all([
      this.prisma.aiThread.count({ where }),
      this.prisma.aiThread.findMany({
        where,
        orderBy: { updated_at: 'desc' },
        take: first + 1,
        cursor: after ? { id: after } : undefined,
        skip: after ? 1 : undefined,
      }),
    ]);

    const hasNextPage = threads.length > first;
    const edges = threads.slice(0, first).map((t) => ({
      cursor: t.id,
      node: this.mapThread(t),
    }));

    const lastEdge = edges[edges.length - 1];

    return {
      edges,
      pageInfo: {
        hasNextPage,
        endCursor: lastEdge ? lastEdge.cursor : null,
      },
      totalCount,
    };
  }

  async updateTitle(threadId: string, userId: number, title: string): Promise<AIThread | null> {
    const thread = await this.findById(threadId, userId);
    if (!thread) return null;

    const updated = await this.prisma.aiThread.update({
      where: { id: threadId },
      data: { title },
    });

    return this.mapThread(updated);
  }

  async delete(threadId: string, userId: number): Promise<boolean> {
    const thread = await this.findById(threadId, userId);
    if (!thread) return false;

    await this.prisma.aiThread.update({
      where: { id: threadId },
      data: { deleted_at: new Date() },
    });

    return true;
  }

  async addMessage(threadId: string, role: 'user' | 'assistant', content: string, fileIds?: string[]): Promise<AIMessage> {
    const now = new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      const msg = await tx.aiMessage.create({
        data: {
          threadId,
          role: role as AiMessageRoleEnum,
          content,
          ...(fileIds && fileIds.length > 0
            ? { files: { create: fileIds.map((fileId) => ({ fileId })) } }
            : {}),
        },
        include: { files: { include: { file: true } } },
      });
      await tx.aiThread.update({
        where: { id: threadId },
        data: { updated_at: now, lastMessageAt: now },
      });
      return msg;
    });

    return this.mapMessageWithFiles(result);
  }

  async addToolMessage(threadId: string, content: string, toolName: string, toolStatus: 'running' | 'success' | 'error', toolDescription?: string): Promise<AIMessage> {
    const now = new Date();

    const [message] = await this.prisma.$transaction([
      this.prisma.aiMessage.create({
        data: {
          threadId,
          role: 'tool' as AiMessageRoleEnum,
          content,
          toolName,
          toolStatus,
          toolDescription,
        },
      }),
      this.prisma.aiThread.update({
        where: { id: threadId },
        data: { lastMessageAt: now },
      }),
    ]);

    return this.mapMessage(message);
  }

  async updateToolMessage(messageId: string, content: string, toolStatus: 'running' | 'success' | 'error'): Promise<AIMessage | null> {
    const message = await this.prisma.aiMessage.update({
      where: { id: messageId },
      data: { content, toolStatus },
    });

    return this.mapMessage(message);
  }

  async getMessages(threadId: string, userId: number, options: { first?: number; before?: string | null } = {}): Promise<AIMessageConnection> {
    const { first = 50, before } = options;

    const thread = await this.findById(threadId, userId);
    if (!thread) {
      return { edges: [], pageInfo: { hasNextPage: false, endCursor: null }, totalCount: 0 };
    }

    const [totalCount, messages] = await Promise.all([
      this.prisma.aiMessage.count({ where: { threadId } }),
      this.prisma.aiMessage.findMany({
        where: { threadId },
        orderBy: { created_at: 'desc' },
        take: first + 1,
        ...(before && { cursor: { id: before }, skip: 1 }),
        include: { files: { include: { file: true } } },
      }),
    ]);

    const hasNextPage = messages.length > first;
    const slicedMessages = messages.slice(0, first);
    const chronologicalMessages = slicedMessages.reverse();

    const edges = chronologicalMessages.map((m) => ({
      cursor: m.id,
      node: this.mapMessageWithFiles(m),
    }));

    const firstEdge = edges[0];

    return {
      edges,
      pageInfo: {
        hasNextPage,
        endCursor: firstEdge ? firstEdge.cursor : null,
      },
      totalCount,
    };
  }

  /**
   * Get messages for AI history (excludes tool messages since AI doesn't need them)
   */
  async getMessagesForAIHistory(threadId: string, limit = 20): Promise<Array<{ role: 'user' | 'assistant'; content: string; attachments?: AiFileAttachment[] }>> {
    const messages = await this.prisma.aiMessage.findMany({
      where: {
        threadId,
        role: { in: ['user', 'assistant'] },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      include: { files: { include: { file: true } } },
    });

    return messages.reverse().map((m) => {
      const attachments = this.mapFileAttachments((m as any).files);
      return {
        role: m.role as 'user' | 'assistant',
        content: m.content,
        ...(attachments.length > 0 ? { attachments } : {}),
      };
    });
  }

  // ─── Mappers ─────────────────────────────────────────────

  private mapThread(raw: any): AIThread {
    return {
      id: raw.id,
      title: raw.title,
      userId: raw.userId,
      lastMessageAt: raw.lastMessageAt,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }

  private mapMessage(raw: any): AIMessage {
    return {
      id: raw.id,
      threadId: raw.threadId,
      role: raw.role as 'user' | 'assistant' | 'tool',
      content: raw.content,
      toolName: raw.toolName,
      toolStatus: raw.toolStatus,
      toolDescription: raw.toolDescription,
      createdAt: raw.created_at,
    };
  }

  private mapMessageWithFiles(raw: any): AIMessage {
    const attachments = this.mapFileAttachments(raw.files);
    return {
      ...this.mapMessage(raw),
      ...(attachments.length > 0 ? { attachments } : {}),
    };
  }

  private mapFileAttachments(files: any[] | undefined): AiFileAttachment[] {
    if (!files || files.length === 0) return [];
    return files.map((mf: any) => ({
      id: mf.id,
      fileId: mf.fileId,
      filename: mf.file.filename,
      mimeType: mf.file.mimeType,
      size: mf.file.size,
      key: mf.file.key,
      bucket: mf.file.bucket,
      region: mf.file.region,
      extractedContent: mf.extractedContent,
      extractionType: mf.extractionType,
    }));
  }
}
