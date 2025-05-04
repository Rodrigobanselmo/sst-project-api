import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskAggregateMapper } from '../../mappers/aggregate/task-aggregate.mapper';
import { ITaskAggregateRepository } from './task-aggregate.types';

@Injectable()
export class TaskAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      action_plan: true,
      history: true,
      project: true,
      responsible: true,
      photos: true,
    } satisfies Prisma.TaskFindFirstArgs['include'];

    return { include };
  }

  async create(params: ITaskAggregateRepository.CreateParams): ITaskAggregateRepository.CreateReturn {
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.systemFile.updateMany({
        where: {
          id: { in: params.photos.map((photo) => photo.fileId) },
        },
        data: {
          should_delete: false,
        },
      });

      const task = await this.prisma.task.create({
        data: {
          action_plan_id: params.actionPlan?.id,
          company_id: params.task.companyId,
          done_date: params.task.doneDate,
          end_date: params.task.endDate,
          project_id: params.project?.id,
          status_id: params.task.statusId,
          description: params.task.description,
          creator_id: params.task.creatorId,
          photos: params.photos.length
            ? {
                createMany: {
                  skipDuplicates: true,
                  data: params.photos.map((photo) => ({
                    file_id: photo.fileId,
                  })),
                },
              }
            : undefined,
          responsible: params.responsible.length
            ? {
                createMany: {
                  skipDuplicates: true,
                  data: params.responsible.map((responsible) => ({
                    user_id: responsible.userId,
                  })),
                },
              }
            : undefined,
          history: params.history.length
            ? {
                createMany: {
                  data: params.history.map((history) => ({
                    user_id: history.userId,
                    text: history.text,
                    changes: history.changes as any,
                  })),
                },
              }
            : undefined,
        },
        ...TaskAggregateRepository.selectOptions(),
      });

      return task;
    });

    return result ? TaskAggregateMapper.toAggregate(result) : null;
  }

  async update(params: ITaskAggregateRepository.UpdateParams): ITaskAggregateRepository.UpdateReturn {
    const deletedPhotos = params.photos.filter((photo) => photo.isDeleted);
    const createdPhotos = params.photos.filter((photo) => photo.isNew);

    const createdHistory = params.history.filter((history) => history.isNew);

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.systemFile.updateMany({
        where: {
          id: { in: createdPhotos.map((photo) => photo.fileId) },
        },
        data: {
          should_delete: false,
        },
      });

      const task = await tx.task.update({
        where: { id: params.task.id, company_id: params.task.companyId },
        data: {
          action_plan_id: params.actionPlan?.id,
          done_date: params.task.doneDate,
          end_date: params.task.endDate,
          deleted_at: params.task.deletedAt,
          project_id: params.project?.id,
          status_id: params.task.statusId,
          description: params.task.description,
          responsible: {
            deleteMany: {},
            createMany: params.responsible.length
              ? {
                  skipDuplicates: true,
                  data: params.responsible.map((responsible) => ({
                    user_id: responsible.userId,
                  })),
                }
              : undefined,
          },
          history: createdHistory.length
            ? {
                createMany: {
                  data: createdHistory.map((history) => ({
                    user_id: history.userId,
                    text: history.text,
                    changes: history.changes as any,
                  })),
                },
              }
            : undefined,
          photos:
            deletedPhotos.length || createdPhotos.length
              ? {
                  deleteMany: deletedPhotos.length
                    ? deletedPhotos.map((photo) => ({
                        file_id: photo.fileId,
                      }))
                    : undefined,
                  createMany: createdPhotos.length
                    ? {
                        data: createdPhotos.map((photo) => ({
                          file_id: photo.fileId,
                        })),
                      }
                    : undefined,
                }
              : undefined,
        },
        ...TaskAggregateRepository.selectOptions(),
      });

      return task;
    });

    return result ? TaskAggregateMapper.toAggregate(result) : null;
  }

  async find(params: ITaskAggregateRepository.FindParams): ITaskAggregateRepository.FindReturn {
    const task = await this.prisma.task.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
      ...TaskAggregateRepository.selectOptions(),
    });

    return task ? TaskAggregateMapper.toAggregate(task) : null;
  }
}
