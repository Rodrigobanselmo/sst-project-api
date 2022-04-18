/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { IPrismaOptions } from 'src/shared/interfaces/prisma-options.types';
import { transformStringToObject } from 'src/shared/utils/transformStringToObject';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../dto/employee.dto';
import { EmployeeEntity } from '../../entities/employee.entity';

@Injectable()
export class EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    workplaceId,
    hierarchyId,
    companyId,
    ...createCompanyDto
  }: CreateEmployeeDto): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.create({
      data: {
        ...createCompanyDto,
        company: { connect: { id: companyId } },
        workplace: {
          connect: { id_companyId: { companyId, id: workplaceId } },
        },
        hierarchy: {
          connect: { id: hierarchyId },
        },
      },
    });

    return new EmployeeEntity(employee);
  }

  async update({
    workplaceId,
    hierarchyId,
    companyId,
    id,
    ...createCompanyDto
  }: UpdateEmployeeDto): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.update({
      data: {
        ...createCompanyDto,
        workplace: !workplaceId
          ? undefined
          : {
              connect: { id_companyId: { companyId, id: workplaceId } },
            },
        hierarchy: !hierarchyId
          ? undefined
          : {
              connect: { id: hierarchyId },
            },
      },
      where: { id_companyId: { companyId, id } },
    });

    return new EmployeeEntity(employee);
  }

  async upsertMany(
    upsertEmployeeMany: (CreateEmployeeDto & { id: number })[],
    companyId: string,
  ): Promise<EmployeeEntity[]> {
    const data = await this.prisma.$transaction(
      upsertEmployeeMany.map(
        ({
          companyId: _,
          id,
          workplaceId,
          hierarchyId,
          ...upsertEmployeeDto
        }) =>
          this.prisma.employee.upsert({
            create: {
              ...upsertEmployeeDto,
              company: { connect: { id: companyId } },
              workplace: {
                connect: { id_companyId: { companyId, id: workplaceId } },
              },
              hierarchy: {
                connect: { id: hierarchyId },
              },
            },
            update: {
              ...upsertEmployeeDto,
              workplace: !workplaceId
                ? undefined
                : {
                    connect: { id_companyId: { companyId, id: workplaceId } },
                  },
              hierarchy: !hierarchyId
                ? undefined
                : {
                    connect: { id: hierarchyId },
                  },
            },
            where: { id_companyId: { companyId, id: id || -1 } },
          }),
      ),
    );

    return data.map((employee) => new EmployeeEntity(employee));
  }

  async findById(
    id: number,
    companyId: string,
    options?: IPrismaOptions<{ hierarchy?: boolean; company?: string }>,
  ): Promise<EmployeeEntity> {
    const include = options?.include || {};

    const employee = await this.prisma.employee.findUnique({
      where: { id_companyId: { companyId, id } },
      include: {
        company: !!include?.company,
        hierarchy: !!include?.hierarchy
          ? false
          : {
              ...transformStringToObject(
                Array.from({ length: 6 })
                  .map(() => 'include.parent')
                  .join('.'),
                true,
              ),
            },
      },
    });

    return new EmployeeEntity(employee);
  }

  async findAllByCompany(
    companyId: string,
    options?: IPrismaOptions<{ hierarchy?: boolean }>,
  ): Promise<EmployeeEntity[]> {
    const include = options?.include || {};

    console.log(include?.hierarchy);

    const employees = await this.prisma.employee.findMany({
      where: { companyId },
      include: {
        hierarchy: include?.hierarchy
          ? {
              ...transformStringToObject(
                Array.from({ length: 6 })
                  .map(() => 'include.parent')
                  .join('.'),
                true,
              ),
            }
          : false,
      },
    });

    return employees.map((employee) => new EmployeeEntity(employee));
  }
}
