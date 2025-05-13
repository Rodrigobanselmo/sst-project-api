import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskProjectMapper } from '../../mappers/entities/task-project.mapper';
import { ITaskProjectRepository } from './task-project.types';

@Injectable()
export class TaskProjectRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {} satisfies Prisma.TaskProjectFindFirstArgs['include'];

    return { include };
  }

  async create(params: ITaskProjectRepository.CreateParams): ITaskProjectRepository.CreateReturn {
    const taskProject = await this.prisma.taskProject.create({
      data: {
        name: params.name,
        company_id: params.companyId,
        description: params.description,
        status: params.status,
        user_id: params.userId,
      },
      ...TaskProjectRepository.selectOptions(),
    });

    return taskProject ? TaskProjectMapper.toEntity(taskProject) : null;
  }

  async update(params: ITaskProjectRepository.UpdateParams): ITaskProjectRepository.UpdateReturn {
    const task = await this.prisma.taskProject.update({
      where: { id: params.id, company_id: params.companyId },
      data: {
        name: params.name,
        description: params.description,
        status: params.status,
        user_id: params.userId,
      },
      ...TaskProjectRepository.selectOptions(),
    });

    return task ? TaskProjectMapper.toEntity(task) : null;
  }

  async find(params: ITaskProjectRepository.FindParams): ITaskProjectRepository.FindReturn {
    const task = await this.prisma.taskProject.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
      ...TaskProjectRepository.selectOptions(),
    });

    return task ? TaskProjectMapper.toEntity(task) : null;
  }
}
