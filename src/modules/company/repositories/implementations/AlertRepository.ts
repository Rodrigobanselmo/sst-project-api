import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { AlertDto } from '../../dto/alert.dto';
import { AlertEntity } from '../../entities/alert.entity';

@Injectable()
export class AlertRepository {
  constructor(private prisma: PrismaService) { }

  async upsert({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeEmails,
    companyId,
    type,
    emails,
    groupsIds,
    usersIds,
    removeGroupsIds,
    removeUsersIds,
    configJson,
    nextAlert,
    ...data
  }: AlertDto & { system?: boolean; nextAlert?: Date }) {
    const document = await this.prisma.alert.upsert({
      create: {
        companyId,
        ...(groupsIds?.length && { groups: { connect: groupsIds.map((id) => ({ id })) } }),
        ...(usersIds?.length && { users: { connect: usersIds.map((id) => ({ id })) } }),
        ...(emails?.length && { emails }),
        ...(configJson && { configJson: configJson as any }),
        ...(nextAlert !== undefined && { nextAlert }),
        type,
        ...data,
      },
      update: {
        type,
        companyId,
        ...(configJson && { configJson: configJson as any }),
        ...(nextAlert !== undefined && { nextAlert }),
        ...((groupsIds?.length || removeGroupsIds?.length) && {
          groups: {
            ...(groupsIds?.length && { connect: groupsIds.map((id) => ({ id })) }),
            ...(removeGroupsIds?.length && { disconnect: removeGroupsIds.map((id) => ({ id })) }),
          },
        }),
        ...((usersIds?.length || removeUsersIds?.length) && {
          users: {
            ...(usersIds?.length && { connect: usersIds.map((id) => ({ id })) }),
            ...(removeUsersIds?.length && { disconnect: removeUsersIds.map((id) => ({ id })) }),
          },
        }),
        ...(emails && { emails: { set: emails } }),
        ...data,
      },
      where: { companyId_type: { companyId, type } },
    });

    return new AlertEntity(document);
  }

  async findOne(companyId: string, options: Prisma.AlertFindManyArgs = {}) {
    const alerts = await this.prisma.alert.findMany({
      ...options,
      include: {
        company: { select: { isConsulting: true, isGroup: true } },
        users: { select: { id: true, email: true, name: true } },
        groups: { select: { name: true, id: true, companyId: true } },
        ...options?.include,
      },
      where: {
        OR: [
          {
            system: true,
          },
          {
            company: {
              isConsulting: true,
              isGroup: false,
              isClinic: false,
              applyingServiceContracts: {
                some: {
                  status: 'ACTIVE',
                  receivingServiceCompanyId: companyId,
                },
              },
            },
          },
          {
            companyId: companyId,
          },
          {
            company: { companyGroup: { companies: { some: { id: companyId } } } },
          },
        ],
        ...options?.where,
      },
    });

    return alerts.map((alert) => new AlertEntity(alert));
  }

  async findNude(options: Prisma.AlertFindManyArgs = {}) {
    const documents = await this.prisma.alert.findMany({
      ...options,
    });

    return documents.map((document) => new AlertEntity(document));
  }

  async findFirstNude(options: Prisma.AlertFindFirstArgs = {}) {
    const document = await this.prisma.alert.findFirst({
      ...options,
    });

    return new AlertEntity(document);
  }

  async delete(id: number, companyId: string) {
    const document = await this.prisma.alert.delete({
      where: { companyId_id: { companyId, id } },
    });

    return new AlertEntity(document);
  }
}
