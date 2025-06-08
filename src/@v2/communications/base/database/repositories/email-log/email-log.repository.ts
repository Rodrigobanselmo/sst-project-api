import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { EmailLogMapper } from '../../mappers/entities/email-log.mapper';
import { IEmailLogRepository } from './email-log.types';

@Injectable()
export class EmailLogRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async create(params: IEmailLogRepository.CreateParams, cb: () => Promise<void>): IEmailLogRepository.CreateReturn {
    const result = await this.prisma.$transaction(async (tx) => {
      const emailLog = await tx.emailLog.create({
        data: {
          template: params.template,
          data: params.data,
          created_at: params.createdAt || new Date(),
          email: params.email,
        },
      });

      await cb();

      return emailLog;
    });

    return result ? EmailLogMapper.toEntity(result) : null;
  }

  async find(params: IEmailLogRepository.FindParams): IEmailLogRepository.FindReturn {
    const emailLog = await this.prisma.emailLog.findFirst({
      where: { id: params.id },
    });

    return emailLog ? EmailLogMapper.toEntity(emailLog) : null;
  }
}
