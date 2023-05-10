import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { CreateScheduleMedicalVisitDto, FindScheduleMedicalVisitDto, UpdateScheduleMedicalVisitDto } from '../../dto/scheduleMedicalVisit.dto';
import { ScheduleMedicalVisitEntity } from '../../entities/schedule-medical-visit.entity';
import { EmployeeExamsHistoryRepository } from './EmployeeExamsHistoryRepository';

@Injectable()
export class ScheduleMedicalVisitRepository {
  constructor(private prisma: PrismaService, private employeeExamsHistoryRepository: EmployeeExamsHistoryRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create({ companyId, ...data }: CreateScheduleMedicalVisitDto & { userId: number }) {
    const visit = await this.prisma.scheduleMedicalVisit.create({
      data: {
        companyId,
        clinicId: data.clinicId,
        labId: data.labId,
        docId: data.docId,
        userId: data.userId,
        status: data.status,
        doneClinicDate: data.doneClinicDate,
        doneLabDate: data.doneLabDate,
        exams: {
          createMany: {
            data: data.exams.map((exam) => this.employeeExamsHistoryRepository.createManyData({ ...exam, userScheduleId: data.userId })).flat(1),
          },
        },
      },
    });

    return new ScheduleMedicalVisitEntity(visit);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update({ id, companyId, ...data }: UpdateScheduleMedicalVisitDto) {
    const visit = await this.prisma.scheduleMedicalVisit.update({
      data: {
        companyId,
        clinicId: data.clinicId,
        labId: data.labId,
        docId: data.docId,
        status: data.status,
        doneClinicDate: data.doneClinicDate,
        doneLabDate: data.doneLabDate,
      },
      where: { id },
    });

    await this.prisma.employeeExamsHistory.updateMany({
      data: {
        clinicId: data.clinicId,
        doctorId: data.docId,
        status: data.status,
        doneDate: data.doneClinicDate,
      },
      where: { scheduleMedicalVisitId: id, exam: { isAttendance: true } },
    });

    await this.prisma.employeeExamsHistory.updateMany({
      data: {
        clinicId: data.labId,
        doctorId: data.docId,
        status: data.status,
        doneDate: data.doneLabDate,
      },
      where: { scheduleMedicalVisitId: id, exam: { isAttendance: false } },
    });

    return new ScheduleMedicalVisitEntity(visit);
  }

  async find(query: Partial<FindScheduleMedicalVisitDto>, pagination: PaginationQueryDto, options: Prisma.ScheduleMedicalVisitFindManyArgs = {}) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'companyId', 'companiesIds', 'onlyCompany', 'companiesGroupIds', 'uf', 'cities'],
    });

    if (!options.select)
      options.select = {
        id: true,
        status: true,
        companyId: true,
        doneLabDate: true,
        doneClinicDate: true,
        clinic: { select: { id: true, name: true, fantasy: true } },
        company: { select: { id: true, name: true, cnpj: true, fantasy: true } },
        lab: { select: { id: true, name: true, fantasy: true } },
        doc: { include: { professional: true } },
        user: { select: { id: true, name: true, email: true, cpf: true } },
      };

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [{ company: { name: { contains: query.search, mode: 'insensitive' } } }, { company: { fantasy: { contains: query.search, mode: 'insensitive' } } }],
      } as typeof options.where);
      delete query.search;
    }

    if ('companyId' in query) {
      (where.AND as any).push({
        OR: [
          {
            companyId: query.companyId,
          },
          ...(!query.onlyCompany
            ? [
                {
                  company: {
                    receivingServiceContracts: {
                      some: { applyingServiceCompanyId: query.companyId },
                    },
                  },
                },
              ]
            : []),
        ],
      } as typeof options.where);
      delete query.companyId;
    }

    if ('companiesIds' in query) {
      (where.AND as any).push({
        companyId: { in: query.companiesIds },
      } as typeof options.where);
      delete query.companiesIds;
    }

    if ('companiesGroupIds' in query) {
      (where.AND as any).push({
        company: {
          group: { companyGroup: { id: { in: query.companiesGroupIds } } },
        },
      } as typeof options.where);
    }

    if ('cities' in query) {
      (where.AND as any).push({
        company: {
          address: { city: { in: query.cities } },
        },
      } as typeof options.where);
    }

    if ('uf' in query) {
      (where.AND as any).push({
        company: {
          address: { state: { in: query.uf } },
        },
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.scheduleMedicalVisit.count({
        where,
      }),
      this.prisma.scheduleMedicalVisit.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { doneClinicDate: 'desc' },
      }),
    ]);

    return {
      data: response[1].map((cat) => new ScheduleMedicalVisitEntity(cat)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.ScheduleMedicalVisitFindManyArgs = {}) {
    const cats = await this.prisma.scheduleMedicalVisit.findMany({
      ...options,
    });

    return cats.map((cat) => new ScheduleMedicalVisitEntity(cat));
  }

  async countNude(options: Prisma.ScheduleMedicalVisitCountArgs = {}) {
    const count = await this.prisma.scheduleMedicalVisit.count({
      ...options,
    });

    return count;
  }

  async findById({ companyId, id }: { companyId: string; id: number }, options: Prisma.ScheduleMedicalVisitFindFirstArgs = {}) {
    const visit = await this.prisma.scheduleMedicalVisit.findFirst({
      where: { id, companyId },
      include: {
        clinic: true,
        lab: true,
        doc: { include: { professional: true } },
        user: true,
        company: true,
        exams: { select: { id: true, examId: true, employeeId: true, examType: true, scheduleMedicalVisitId: true } },
        // exams: {select:{employeeId:true,examType:true,examId:true,}}
      },
      ...options,
    });

    return new ScheduleMedicalVisitEntity(visit as any);
  }

  async findFirstNude(options: Prisma.ScheduleMedicalVisitFindFirstArgs = {}) {
    const cat = await this.prisma.scheduleMedicalVisit.findFirst({
      ...options,
    });

    return new ScheduleMedicalVisitEntity(cat);
  }

  async delete(id: number) {
    const cat = await this.prisma.scheduleMedicalVisit.delete({
      where: { id },
    });

    return new ScheduleMedicalVisitEntity(cat);
  }

  async updateManyNude(options: Prisma.ScheduleMedicalVisitUpdateManyArgs) {
    const data = await this.prisma.scheduleMedicalVisit.updateMany({
      ...options,
    });

    return data;
  }
}
