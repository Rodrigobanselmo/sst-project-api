import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { FindInvitesDto, InviteUserDto } from '../../dto/invite-user.dto';
import { InviteUsersEntity } from '../../entities/invite-users.entity';
import { IInviteUsersRepository } from '../IInviteUsersRepository.types';
import { Prisma } from '.prisma/client';
import { dayjs } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class InviteUsersRepository implements IInviteUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(inviteUserDto: InviteUserDto, expires_date: Date): Promise<InviteUsersEntity> {
    const inviteUser = await this.prisma.inviteUsers.create({
      data: { ...inviteUserDto, expires_date },
    });
    return new InviteUsersEntity(inviteUser);
  }

  async findByCompanyIdAndEmail(companyId: string, email: string): Promise<InviteUsersEntity | undefined> {
    const invite = await this.prisma.inviteUsers.findFirst({
      where: { email, companyId },
    });
    if (!invite) return;

    return new InviteUsersEntity(invite);
  }

  async findById(id: string, options?: Partial<Prisma.InviteUsersFindUniqueArgs>): Promise<InviteUsersEntity | undefined> {
    const invite = await this.prisma.inviteUsers.findUnique({
      where: { id },
      ...options,
    });
    if (!invite) return;

    return new InviteUsersEntity(invite);
  }

  async findAllByCompanyId(companyId: string): Promise<InviteUsersEntity[]> {
    const invites = await this.prisma.inviteUsers.findMany({
      where: {
        companyId,
        expires_date: { lte: dayjs().add(10, 'year').toDate() },
      },
    });

    return invites.map((invite) => new InviteUsersEntity(invite));
  }

  async findAllByEmail(email: string): Promise<InviteUsersEntity[]> {
    const invites = await this.prisma.inviteUsers.findMany({
      where: { email },
      include: { company: { select: { name: true, logoUrl: true } } },
    });

    return invites.map(
      (invite) =>
        new InviteUsersEntity({
          ...invite,
          companyName: invite.company.name,
          logo: invite.company.logoUrl,
        }),
    );
  }

  async find(query: Partial<FindInvitesDto>, pagination: PaginationQueryDto, options: Prisma.InviteUsersFindManyArgs = {}) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const include = { ...options?.include };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['ids', 'showProfessionals'],
    });

    if ('ids' in query) {
      (where.AND as any).push({
        id: { in: query.ids },
      } as typeof options.where);
    }

    if (!('showProfessionals' in query)) {
      (where.AND as any).push({
        expires_date: { lte: dayjs().add(10, 'year').toDate() },
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.inviteUsers.count({
        where,
      }),
      this.prisma.inviteUsers.findMany({
        where,
        include: Object.keys(include).length > 0 ? include : undefined,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { expires_date: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((exam) => new InviteUsersEntity(exam)),
      count: response[0],
    };
  }

  async deleteById(companyId: string, id: string): Promise<Prisma.BatchPayload> {
    const invite = await this.prisma.inviteUsers.deleteMany({
      where: { id, companyId },
    });
    if (!invite) return;

    return invite;
  }

  async deleteByCompanyIdAndEmail(companyId: string, email: string): Promise<Prisma.BatchPayload> {
    const invite = await this.prisma.inviteUsers.deleteMany({
      where: { email, companyId },
    });
    if (!invite) return;

    return invite;
  }

  async deleteAllOldInvites(currentDate: Date): Promise<Prisma.BatchPayload> {
    const deletedResult = await this.prisma.inviteUsers.deleteMany({
      where: {
        expires_date: {
          lte: currentDate,
        },
      },
    });

    return deletedResult;
  }
}
