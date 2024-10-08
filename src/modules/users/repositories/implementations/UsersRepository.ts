import { ProfessionalEntity } from './../../entities/professional.entity';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma, ProfessionalTypeEnum } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserCompanyDto } from '../../dto/user-company.dto';
import { UserEntity } from '../../entities/user.entity';
import { IUsersRepository } from '../IUsersRepository.types';
import { UserCompanyEntity } from '../../entities/userCompany.entity';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private count = 0;
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: Omit<CreateUserDto, 'token' | 'googleToken'>,
    userCompanyDto: UserCompanyDto[],
    professional?: ProfessionalEntity,
  ) {
    const hasCouncil = professional && professional?.councils && professional.councils.length > 0;

    const councils = hasCouncil
      ? professional.councils
      : [
          {
            councilId: '',
            councilUF: '',
            councilType: '',
          } as any,
        ];

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        professional: {
          create: {
            type: ProfessionalTypeEnum.USER,
            name: createUserDto.name || '',
            email: createUserDto.email,
            ...(professional && {
              phone: professional?.phone,
              cpf: professional?.cpf,
              type: professional?.type,
              name: professional?.name,
            }),
            councils: {
              createMany: {
                data: councils.map((c) => ({
                  councilId: c.councilId,
                  councilUF: c.councilUF,
                  councilType: c.councilType,
                })),
              },
            },
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
      councils,
      ...updateUserDto
    }: UpdateUserDto & { googleUser?: string; facebookUser?: string },
    userCompanyDto: UserCompanyDto[] = [],
  ) {
    const professional = {
      certifications: Array.isArray(certifications) ? certifications.filter((c) => c) : certifications,
      formation: Array.isArray(formation) ? formation.filter((c) => c) : formation,
      councilId,
      councilUF,
      councilType,
      cpf,
      phone,
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
      include: {
        companies: true,
        professional: { include: { councils: true } },
      },
    });
    if (!user) return;

    if (user.professional && councils) {
      councils = councils.filter((c) => c.councilId !== '');
      if (councils.length == 0) {
        councils.push({ councilId: '', councilType: '', councilUF: '' });
      }

      const councilsCreate = await Promise.all(
        councils.map(async ({ councilId, councilType, councilUF, id }) => {
          if ((councilId && councilType && councilUF) || (councilId == '' && councilType == '' && councilUF == ''))
            return await this.prisma.professionalCouncil.upsert({
              create: {
                councilId,
                councilType,
                councilUF,
                professionalId: user.professional.id,
              },
              update: { councilId, councilType, councilUF },
              where: {
                ...(!id && {
                  councilType_councilUF_councilId_professionalId: {
                    councilId,
                    councilType,
                    councilUF,
                    professionalId: user.professional.id,
                  },
                }),
                ...(id && { id }),
              },
            });
        }),
      );

      await Promise.all(
        user.professional.councils.map(async (c) => {
          if (councilsCreate.find((cCreated) => cCreated?.id == c.id)) return;
          try {
            await this.prisma.professionalCouncil.delete({
              where: {
                id: c.id,
              },
            });
          } catch (err) {}
        }),
      );

      (user.professional as any).councils = councilsCreate;
    }

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
        professional: { include: { councils: true } },
      },
    });
    return users.map(
      (user) =>
        new UserEntity({
          ...(user as any),
          professional: new ProfessionalEntity(user?.professional as any),
        }),
    );
  }

  async findFirstNude(options: Prisma.UserFindFirstArgs = {}) {
    const professional = await this.prisma.user.findFirst({
      ...options,
    });

    return new UserEntity(professional);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        companies: { include: { group: { select: { permissions: true, roles: true } } } },
        professional: { include: { councils: true } },
      },
    });
    if (!user) return;
    return new UserEntity({
      ...user,
      companies: user.companies.map((c) => new UserCompanyEntity(c)),
      professional: new ProfessionalEntity(user?.professional),
    });
  }

  async findById(id: number, companyId?: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        ...(companyId && { companies: { some: { status: 'ACTIVE', companyId } } }),
      },
      include: {
        companies: { include: { group: { select: { permissions: true, roles: true } } } },
        professional: { include: { councils: true } },
      },
    });
    if (!user) return;

    return new UserEntity({
      ...(user as any),
      companyId,
      professional: new ProfessionalEntity(user?.professional),
      companies: user.companies.map((c) => new UserCompanyEntity(c)),
    });
  }

  async findByGoogleExternalId(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { googleExternalId: id },
      include: {
        companies: true,
        professional: { include: { councils: true } },
      },
    });
    if (!user) return;
    return new UserEntity({
      ...user,
      professional: new ProfessionalEntity(user?.professional),
    });
  }
}
