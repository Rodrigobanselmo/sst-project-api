import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { SystemAiPromptKeyEnum } from '@prisma/client';

@Injectable()
export class SystemAiPromptRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async findByKey(key: SystemAiPromptKeyEnum) {
    return this.prisma.systemAiPrompt.findUnique({
      where: { key },
      select: {
        id: true,
        key: true,
        content: true,
        revision: true,
        updatedBy: true,
        updated_at: true,
        created_at: true,
      },
    });
  }

  async upsertByKey(params: {
    key: SystemAiPromptKeyEnum;
    content: string;
    updatedBy: number;
  }) {
    const existing = await this.findByKey(params.key);

    if (existing) {
      return this.prisma.systemAiPrompt.update({
        where: { key: params.key },
        data: {
          content: params.content,
          revision: existing.revision + 1,
          updatedBy: params.updatedBy,
        },
        select: {
          id: true,
          key: true,
          content: true,
          revision: true,
          updatedBy: true,
          updated_at: true,
          created_at: true,
        },
      });
    }

    return this.prisma.systemAiPrompt.create({
      data: {
        key: params.key,
        content: params.content,
        updatedBy: params.updatedBy,
      },
      select: {
        id: true,
        key: true,
        content: true,
        revision: true,
        updatedBy: true,
        updated_at: true,
        created_at: true,
      },
    });
  }
}
