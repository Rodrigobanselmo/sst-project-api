/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { CompanyEntity } from '../../entities/company.entity';
import { ICompanyRepository } from '../ICompanyRepository.types';
import { v4 as uuidV4 } from 'uuid';
import { UpdateCompanyDto } from '../../dto/update-company.dto';

interface ICreateCompany extends CreateCompanyDto {
  companyId?: string;
}

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    workspace = [],
    primary_activity = [],
    secondary_activity = [],
    license,
    companyId,
    ...createCompanyDto
  }: ICreateCompany): Promise<CompanyEntity> {
    const companyUUId = uuidV4();
    const isReceivingService = !!companyId;

    const company = await this.prisma.company.create({
      data: {
        id: companyUUId,
        ...createCompanyDto,
        license: {
          connectOrCreate: {
            create: { ...license, companyId: companyUUId },
            where: { companyId: companyId || 'company not found' },
          },
        },
        receivingServiceContracts: isReceivingService
          ? {
              create: { applyingServiceCompanyId: companyId },
            }
          : undefined,
        workspace: {
          create: [
            ...workspace.map(({ id, address, ...work }) => ({
              ...work,
              address: { create: address },
            })),
          ],
        },
        // TODO: should be connect only
        primary_activity: {
          connectOrCreate: [
            ...primary_activity.map((activity) => ({
              create: activity,
              where: { code: activity.code },
            })),
          ],
        },
        // TODO: should be connect only
        secondary_activity: {
          connectOrCreate: [
            ...secondary_activity.map((activity) => ({
              create: activity,
              where: { code: activity.code },
            })),
          ],
        },
      },
      include: {
        workspace: { include: { address: true } },
        primary_activity: true,
        secondary_activity: true,
        license: true,
      },
    });

    return new CompanyEntity(company);
  }

  async updateInsert({
    secondary_activity = [],
    primary_activity = [],
    workspace = [],
    users = [],
    license,
    companyId,
    ...updateCompanyDto
  }: UpdateCompanyDto) {
    const company = await this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...updateCompanyDto,
        users: {
          upsert: [
            ...users.map(({ userId, ...user }) => {
              const { roles = [], permissions = [] } = user;
              return {
                create: { ...user, permissions, roles, userId },
                update: { ...user },
                where: {
                  companyId_userId: { companyId, userId },
                },
              };
            }),
          ],
        },
        workspace: {
          upsert: [
            ...workspace.map(({ id, address, ...work }) => ({
              create: {
                ...work,
                address: { create: address },
              },
              update: {
                ...work,
                address: { update: address },
              },
              where: { id: id ?? -1 },
            })),
          ],
        },
        // TODO: should be connect only
        primary_activity: {
          connectOrCreate: [
            ...primary_activity.map((activity) => ({
              create: activity,
              where: { code: activity.code },
            })),
          ],
        },
        secondary_activity: {
          connect: [
            ...secondary_activity.map((activity) => ({ code: activity.code })),
          ],
        },
      },
      include: {
        workspace: { include: { address: true } },
        primary_activity: true,
        secondary_activity: true,
        license: true,
        users: true,
      },
    });

    return new CompanyEntity(company);
  }

  async updateDisconnect({
    secondary_activity = [],
    primary_activity = [],
    workspace = [],
    license,
    users = [],
    companyId,
    ...updateCompanyDto
  }: UpdateCompanyDto) {
    const company = await this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...updateCompanyDto,
        users: {
          delete: [
            ...users.map(({ userId }) => ({
              companyId_userId: {
                companyId: companyId,
                userId,
              },
            })),
          ],
        },
        primary_activity: {
          disconnect: [
            ...primary_activity.map((activity) => ({ code: activity.code })),
          ],
        },
        secondary_activity: {
          disconnect: [
            ...secondary_activity.map((activity) => ({ code: activity.code })),
          ],
        },
      },
      include: {
        workspace: { include: { address: true } },
        primary_activity: true,
        secondary_activity: true,
        license: true,
      },
    });

    return new CompanyEntity(company);
  }

  // async removeById(id: number) {
  //   const user = await this.prisma.user.delete({ where: { id: id } });
  //   if (!user) return;
  //   return new UserEntity(user);
  // }

  // async findAll() {
  //   const users = await this.prisma.user.findMany();
  //   return users.map((user) => new UserEntity(user));
  // }

  // async findByEmail(email: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { email },
  //     include: { companies: true },
  //   });
  //   if (!user) return;
  //   return new UserEntity(user);
  // }

  // async findById(id: number) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id },
  //     include: { companies: true },
  //   });
  //   if (!user) return;
  //   return new UserEntity(user);
  // }
}
