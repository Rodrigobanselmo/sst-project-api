import { TaskProjectAggregateRepository } from '@/@v2/task/database/repositories/task-project/task-project-aggregate.repository';
import { TaskProjectAggregate } from '@/@v2/task/domain/aggregations/task-project.aggregate';
import { TaskProjectMemberEntity } from '@/@v2/task/domain/entities/task-project-member.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ITaskProjectUseCase } from './edit-task-project.types';

@Injectable()
export class EditTaskProjectUseCase {
  constructor(private readonly taskProjectRepository: TaskProjectAggregateRepository) {}

  async execute(params: ITaskProjectUseCase.Params) {
    const task = await this.taskProjectRepository.find({ id: params.id, companyId: params.companyId });
    if (!task) throw new BadRequestException('Projeto não encontrado');

    this.updateMembers({ params, taskProject: task });

    task.update({
      description: params.description,
      name: params.name,
      status: params.status,
    });

    await this.taskProjectRepository.update(task);
  }

  private updateMembers({ params, taskProject }: { params: ITaskProjectUseCase.Params; taskProject: TaskProjectAggregate }) {
    params.members?.forEach((member) => {
      const isAdd = member.userId && !member.id;
      const isDelete = member.id && member.delete;

      const memberEntity = new TaskProjectMemberEntity({
        id: member.id,
        userId: member.userId,
      });

      if (isAdd) {
        const [, error] = taskProject.addMember(memberEntity);
        if (error) throw new BadRequestException(error.message);
      }

      if (isDelete) {
        const [, error] = taskProject.removeMember(memberEntity);
        if (error) throw new BadRequestException(error.message);
      }
    });
  }
}
