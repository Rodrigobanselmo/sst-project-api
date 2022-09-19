import { ProfessionalEntity } from './../../entities/professional.entity';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ProfessionalTypeEnum } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserCompanyDto } from '../../dto/user-company.dto';
import { UserEntity } from '../../entities/user.entity';
import { IUsersRepository } from '../IUsersRepository.types';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private count = 0;
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: Omit<CreateUserDto, 'token'>,
    userCompanyDto: UserCompanyDto[],
    professional?: ProfessionalEntity,
  ) {
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        professional: {
          create: {
            type: ProfessionalTypeEnum.USER,
            name: '',
            email: createUserDto.email,
            ...(professional && {
              councilId: professional?.councilId,
              councilType: professional?.councilType,
              councilUF: professional?.councilUF,
              phone: professional?.phone,
              cpf: professional?.cpf,
              type: professional?.type,
              name: professional?.name,
            }),
          },
        },
        companies: { create: userCompanyDto },
      },
      include: { companies: true },
    });

    return new UserEntity(user);
  }

  async update(
    id: number,
    {
      oldPassword,
      certifications,
      councilId,
      councilUF,
      councilType,
      cpf,
      phone,
      formation,
      type,
      name,
      ...updateUserDto
    }: UpdateUserDto,
    userCompanyDto: UserCompanyDto[] = [],
  ) {
    const professional = {
      certifications,
      councilId,
      councilUF,
      councilType,
      cpf,
      phone,
      formation,
      type,
      name,
    };

    const user = await this.prisma.user.update({
      where: { id: id },
      data: {
        ...updateUserDto,
        cpf,
        name,
        phone,
        professional: {
          upsert: {
            update: {
              ...professional,
            },
            create: {
              ...professional,
              name: name || '',
            },
          },
        },
        companies: { create: userCompanyDto },
      },
      include: { companies: true, professional: true },
    });
    if (!user) return;
    return new UserEntity({
      ...user,
      professional: new ProfessionalEntity(user?.professional),
    });
  }

  async removeById(id: number) {
    const user = await this.prisma.user.delete({ where: { id: id } });
    if (!user) return;
    return new UserEntity(user);
  }

  async findAllByCompany(companyId?: string) {
    const users = await this.prisma.user.findMany({
      where: {
        companies: {
          some: {
            OR: [
              {
                companyId,
              },
              {
                company: {
                  receivingServiceContracts: {
                    some: { applyingServiceCompanyId: companyId },
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        companies: {
          include: { group: true },
          where: {
            OR: [
              {
                companyId,
              },
              {
                company: {
                  receivingServiceContracts: {
                    some: { applyingServiceCompanyId: companyId },
                  },
                },
              },
            ],
          },
          // take: 1,
          orderBy: { status: 'asc' },
        },
        professional: true,
      },
    });
    return users.map(
      (user) =>
        new UserEntity({
          ...user,
          professional: new ProfessionalEntity(user?.professional),
        }),
    );
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { companies: true, professional: true },
    });
    if (!user) return;
    return new UserEntity({
      ...user,
      professional: new ProfessionalEntity(user?.professional),
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { companies: true, professional: true },
    });
    if (!user) return;
    return new UserEntity({
      ...user,
      professional: new ProfessionalEntity(user?.professional),
    });
  }

  async findByGoogleExternalId(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { googleExternalId: id },
      include: { companies: true, professional: true },
    });
    if (!user) return;
    return new UserEntity({
      ...user,
      professional: new ProfessionalEntity(user?.professional),
    });
  }
}
