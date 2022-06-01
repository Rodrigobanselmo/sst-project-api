/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import { transformStringToObject } from '../../../../shared/utils/transformStringToObject';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../dto/employee.dto';
import { EmployeeEntity } from '../../entities/employee.entity';

@Injectable()
export class EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    workspaceIds,
    hierarchyId,
    companyId,
    ...createCompanyDto
  }: CreateEmployeeDto): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.create({
      data: {
        ...createCompanyDto,
        company: { connect: { id: companyId } },
        workspaces: {
          connect: workspaceIds.map((id) => ({
            id_companyId: { companyId, id },
          })),
        },
        hierarchy: {
          connect: { id: hierarchyId },
        },
      },
    });

    return new EmployeeEntity(employee);
  }

  async update({
    workspaceIds,
    hierarchyId,
    companyId,
    id,
    ...createCompanyDto
  }: UpdateEmployeeDto): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.update({
      data: {
        ...createCompanyDto,
        workspaces: !workspaceIds
          ? undefined
          : {
              set: workspaceIds.map((id) => ({
                id_companyId: { companyId, id },
              })),
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
          workspaceIds,
          hierarchyId,
          ...upsertEmployeeDto
        }) =>
          this.prisma.employee.upsert({
            create: {
              ...upsertEmployeeDto,
              company: { connect: { id: companyId } },
              workspaces: {
                connect: workspaceIds.map((id) => ({
                  id_companyId: { companyId, id },
                })),
              },
              hierarchy: {
                connect: { id: hierarchyId },
              },
            },
            update: {
              ...upsertEmployeeDto,
              workspaces: !workspaceIds
                ? undefined
                : {
                    set: workspaceIds.map((id) => ({
                      id_companyId: { companyId, id },
                    })),
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
