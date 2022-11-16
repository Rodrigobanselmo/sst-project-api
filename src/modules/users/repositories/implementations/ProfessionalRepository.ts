import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateProfessionalDto, FindProfessionalsDto, UpdateProfessionalDto } from '../../dto/professional.dto';
import { ProfessionalEntity } from '../../entities/professional.entity';
import { UserEntity } from '../../entities/user.entity';
import { UserCompanyEntity } from '../../entities/userCompany.entity';
import dayjs from 'dayjs';
import { InviteUsersEntity } from '../../entities/invite-users.entity';

@Injectable()
export class ProfessionalRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    { inviteId, roles, councils, ...data }: Omit<CreateProfessionalDto & { roles?: string[] }, 'sendEmail' | 'userId'>,
    companyId: string,
    options: Partial<Prisma.ProfessionalCreateArgs> = {},
  ) {
    const invite = await this.prisma.inviteUsers.create({
      data: {
        id: inviteId,
        expires_date: dayjs().add(100, 'y').toDate(),
        email: data.email,
        companyId,
        companiesIds: [companyId],
        permissions: [],
        roles: roles || [],
      },
    });

    const hasCouncil = councils && councils.length > 0;
    if (!hasCouncil) {
      councils = [
        {
          councilId: '',
          councilUF: '',
          councilType: '',
        },
      ];
    }

    const professional = await this.prisma.professional.create({
      ...options,
      data: {
        ...data,
        companyId,
        inviteId: invite.id,
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
      include: { user: true, ...options.include },
    });

    return new ProfessionalEntity({
      ...professional,
      user: new UserEntity(professional.user),
      invite: new InviteUsersEntity(invite),
    });
  }

  async update({ id, inviteId, councils, ...data }: Omit<UpdateProfessionalDto, 'sendEmail' | 'userId'>, options: Partial<Prisma.ProfessionalUpdateArgs> = {}) {
    const professional = await this.prisma.professional.update({
      ...options,
      data: { ...data },
      where: { id },
      include: { user: true, ...options.include, councils: true },
    });

    if (professional?.id && councils) {
      councils = councils.filter((c) => c.councilId !== '');

      if (councils.length == 0) {
        councils.push({ councilId: '', councilType: '', councilUF: '' });
      }

      const councilsCreate = await Promise.all(
        councils.map(async ({ councilId, councilType, councilUF }) => {
          if ((councilId && councilType && councilUF) || (councilId == '' && councilType == '' && councilUF == ''))
            return await this.prisma.professionalCouncil.upsert({
              create: {
                councilId,
                councilType,
                councilUF,
                professionalId: professional.id,
              },
              update: {},
              where: {
                councilType_councilUF_councilId_professionalId: {
                  councilId,
                  councilType,
                  councilUF,
                  professionalId: professional.id,
                },
              },
            });
        }),
      );

      await Promise.all(
        professional.councils.map(async (c) => {
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

      (professional as any).councils = councilsCreate.filter((i) => i);
    }

    return new ProfessionalEntity({
      ...professional,
      user: new UserEntity(professional.user),
    });
  }

  async findByCompanyId(query: Partial<FindProfessionalsDto>, pagination: PaginationQueryDto, options: Prisma.ProfessionalFindManyArgs = {}) {
    const companyId = query.companyId;
    const userCompanyId = query.userCompanyId;
    delete query.companyId;
    delete query.userCompanyId;

    const where = {
      AND: [
        {
          OR: [
            { companyId: { in: [userCompanyId, companyId] } },
            {
              user: {
                companies: {
                  some: {
                    companyId: { in: [userCompanyId, companyId] },
                    status: 'ACTIVE',
                  },
                },
              },
            },
            // {
            //   company: {
            //     applyingServiceContracts: {
            //       some: { receivingServiceCompanyId: companyId }, // macDonald can see connapa's professionals
            //     },
            //   },
            // },
            // {
            //   user: {
            //     OR: [
            //       { companies: { some: { companyId, status: 'ACTIVE' } } },
            //       {
            //         companies: {
            //           some: {
            //             company: {
            //               applyingServiceContracts: {
            //                 some: { receivingServiceCompanyId: companyId },
            //               },
            //             },
            //           },
            //         },
            //       },
            //     ],
            //   },
            // },
          ],
        },
      ],
    } as typeof options.where;

    if ('search' in query) {
      (where.AND as any).push({
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          // { councilId: { contains: query.search, mode: 'insensitive' } },
        ],
      } as typeof options.where);
      delete query.search;
    }

    if ('companies' in query) {
      (where.AND as any).push({
        OR: [
          {
            company: { id: { in: query.companies } },
          },
          {
            user: {
              companies: {
                some: {
                  companyId: { in: query.companies },
                  status: 'ACTIVE',
                },
              },
            },
          },
        ],
      } as typeof options.where);
      delete query.companies;
    }

    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        (where.AND as any).push({
          [key]: { in: value },
        } as typeof options.where);
      } else if (value) {
        (where.AND as any).push({
          [key]: {
            contains: value,
            mode: 'insensitive',
          },
        } as typeof options.where);
      }
    });

    const response = await this.prisma.$transaction([
      this.prisma.professional.count({
        where,
      }),
      this.prisma.professional.findMany({
        where,
        take: pagination.take || 10,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
        include: { user: true, councils: true },
      }),
    ]);

    return {
      data: response[1].map((prof) => new ProfessionalEntity({ ...prof, user: new UserEntity(prof.user) })),
      count: response[0],
    };
  }

  async findCouncilByCompanyId(query: Partial<FindProfessionalsDto>, pagination: PaginationQueryDto, options: Prisma.ProfessionalFindManyArgs = {}) {
    const companyId = query.companyId;
    const userCompanyId = query.userCompanyId;
    const byCouncil = query.byCouncil;
    delete query.companyId;
    delete query.byCouncil;
    delete query.userCompanyId;

    const where = {
      AND: [
        {
          OR: [
            { companyId: { in: [userCompanyId, companyId] } },
            {
              user: {
                companies: {
                  some: {
                    companyId: { in: [userCompanyId, companyId] },
                    status: 'ACTIVE',
                  },
                },
              },
            },
            // {
            //   company: {
            //     applyingServiceContracts: {
            //       some: { receivingServiceCompanyId: companyId }, // macDonald can see connapa's professionals
            //     },
            //   },
            // },
            // {
            //   user: {
            //     OR: [
            //       { companies: { some: { companyId, status: 'ACTIVE' } } },
            //       {
            //         companies: {
            //           some: {
            //             company: {
            //               applyingServiceContracts: {
            //                 some: { receivingServiceCompanyId: companyId },
            //               },
            //             },
            //           },
            //         },
            //       },
            //     ],
            //   },
            // },
          ],
        },
      ],
    } as typeof options.where;

    if ('search' in query) {
      (where.AND as any).push({
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          // { councilId: { contains: query.search, mode: 'insensitive' } },
        ],
      } as typeof options.where);
      delete query.search;
    }

    if ('companies' in query) {
      (where.AND as any).push({
        OR: [
          {
            company: { id: { in: query.companies } },
          },
          {
            user: {
              companies: {
                some: {
                  companyId: { in: query.companies },
                  status: 'ACTIVE',
                },
              },
            },
          },
        ],
      } as typeof options.where);
      delete query.companies;
    }

    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        (where.AND as any).push({
          [key]: { in: value },
        } as typeof options.where);
      } else if (value) {
        (where.AND as any).push({
          [key]: {
            contains: value,
            mode: 'insensitive',
          },
        } as typeof options.where);
      }
    });

    const response = byCouncil
      ? await this.prisma.$transaction([
          this.prisma.professionalCouncil.count({
            where: {
              professional: where,
            },
          }),
          this.prisma.professionalCouncil.findMany({
            where: {
              professional: where,
            },
            take: pagination.take || 10,
            skip: pagination.skip || 0,
            orderBy: { professional: { name: 'asc' } },
            include: {
              professional: { include: { user: true } },
            },
          }),
        ])
      : await this.prisma.$transaction([
          this.prisma.professional.count({
            where,
          }),
          this.prisma.professional.findMany({
            where,
            take: pagination.take || 10,
            skip: pagination.skip || 0,
            orderBy: { name: 'asc' },
            include: { user: true, councils: true },
          }),
        ]);

    return {
      data: response[1].map((prof) => new ProfessionalEntity({ ...prof, user: new UserEntity(prof.user) })),
      count: response[0],
    };
  }

  async findFirstNude(options: Prisma.ProfessionalFindFirstArgs = {}) {
    const professional = await this.prisma.professional.findFirst({
      ...options,
      // include: { user: { select: { email: true, id: true } } },
    });

    return new ProfessionalEntity(professional);
  }
}
