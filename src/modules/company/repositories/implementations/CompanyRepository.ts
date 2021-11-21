/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { CompanyEntity } from '../../entities/company.entity';
import { ICompanyRepository } from '../ICompanyRepository.types';
import { v4 as uuidV4 } from 'uuid';

interface ICreateCompany extends CreateCompanyDto {
  // licenseId?: number;
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

    const contractInfo = isReceivingService
      ? {
          license: { connect: { companyId: companyId } },
          receivingServiceContracts: {
            create: { applyingServiceCompanyId: companyId },
          },
        }
      : {};

    const company = await this.prisma.company.create({
      data: {
        id: companyUUId,
        license: { create: { ...license, companyId: companyUUId } },
        ...createCompanyDto,
        ...contractInfo,
        workspace: {
          connectOrCreate: [
            ...workspace.map(({ address, ...ws }) => ({
              create: {
                ...ws,
                address: { create: address },
              },
              where: { id: -1 },
            })),
          ],
        },
        primary_activity: {
          connectOrCreate: [
            ...primary_activity.map((activity) => ({
              create: activity,
              where: { code: activity.code },
            })),
          ],
        },
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

  // async update(
  //   id: number,
  //   { email, oldPassword, ...updateUserDto }: UpdateUserDto,
  //   userCompanyDto: UserCompanyDto[] = [],
  // ) {
  //   const user = await this.prisma.user.update({
  //     where: { id: id },
  //     data: { ...updateUserDto, companies: { create: userCompanyDto } },
  //   });
  //   if (!user) return;
  //   return new UserEntity(user);
  // }

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
