import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskProjectAggregateMapper } from '../../mappers/aggregate/task-project-aggregate.mapper';
import { ITaskProjectRepository } from './task-project-aggregate.types';

@Injectable()
export class TaskProjectAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      members: true,
    } satisfies Prisma.TaskProjectFindFirstArgs['include'];

    return { include };
  }

  async create(params: ITaskProjectRepository.CreateParams): ITaskProjectRepository.CreateReturn {
    const taskProject = await this.prisma.taskProject.create({
      data: {
        name: params.project.name,
        company_id: params.project.companyId,
        description: params.project.description,
        status: params.project.status,
        user_id: params.project.userId,
        members: params.members
          ? {
              createMany: {
                data: params.members.map((member) => ({
                  user_id: member.userId,
                })),
              },
            }
          : undefined,
      },
      ...TaskProjectAggregateRepository.selectOptions(),
    });

    return taskProject ? TaskProjectAggregateMapper.toAggregate(taskProject) : null;
  }

  async update(params: ITaskProjectRepository.UpdateParams): ITaskProjectRepository.UpdateReturn {
    const task = await this.prisma.taskProject.update({
      where: { id: params.project.id, company_id: params.project.companyId },
      data: {
        name: params.project.name,
        company_id: params.project.companyId,
        description: params.project.description,
        status: params.project.status,
        user_id: params.project.userId,
        deleted_at: params.project.deletedAt,
      },
      ...TaskProjectAggregateRepository.selectOptions(),
    });

    return task ? TaskProjectAggregateMapper.toAggregate(task) : null;
  }

  async find(params: ITaskProjectRepository.FindParams): ITaskProjectRepository.FindReturn {
    const task = await this.prisma.taskProject.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
      ...TaskProjectAggregateRepository.selectOptions(),
    });

    return task ? TaskProjectAggregateMapper.toAggregate(task) : null;
  }
}
