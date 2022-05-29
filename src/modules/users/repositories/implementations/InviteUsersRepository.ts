/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { InviteUserDto } from '../../dto/invite-user.dto';
import { InviteUsersEntity } from '../../entities/invite-users.entity';
import { IInviteUsersRepository } from '../IInviteUsersRepository.types';
import { Prisma } from '.prisma/client';

@Injectable()
export class InviteUsersRepository implements IInviteUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    inviteUserDto: InviteUserDto,
    expires_date: Date,
  ): Promise<InviteUsersEntity> {
    const inviteUser = await this.prisma.inviteUsers.create({
      data: { ...inviteUserDto, expires_date },
    });
    return new InviteUsersEntity(inviteUser);
  }

  async findByCompanyIdAndEmail(
    companyId: string,
    email: string,
  ): Promise<InviteUsersEntity | undefined> {
    const invite = await this.prisma.inviteUsers.findFirst({
      where: { email, companyId },
    });
    if (!invite) return;

    return new InviteUsersEntity(invite);
  }

  async findById(id: string): Promise<InviteUsersEntity | undefined> {
    const invite = await this.prisma.inviteUsers.findUnique({
      where: { id },
    });
    if (!invite) return;

    return new InviteUsersEntity(invite);
  }

  async findAllByCompanyId(companyId: string): Promise<InviteUsersEntity[]> {
    const invites = await this.prisma.inviteUsers.findMany({
      where: { companyId },
    });

    return invites.map((invite) => new InviteUsersEntity(invite));
  }

  async deleteByCompanyIdAndEmail(
    companyId: string,
    email: string,
  ): Promise<Prisma.BatchPayload> {
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
