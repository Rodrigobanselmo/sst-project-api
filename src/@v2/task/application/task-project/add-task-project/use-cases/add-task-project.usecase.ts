import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { TaskProjectAggregateRepository } from '@/@v2/task/database/repositories/task-project/task-project-aggregate.repository';
import { TaskProjectAggregate } from '@/@v2/task/domain/aggregations/task-project.aggregate';
import { TaskProjectEntity } from '@/@v2/task/domain/entities/task-project.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ITaskProjectUseCase } from './add-task-project.types';
import { TaskProjectMemberEntity } from '@/@v2/task/domain/entities/task-project-member.entity';

@Injectable()
export class AddTaskProjectUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly taskProjectRepository: TaskProjectAggregateRepository,
  ) {}

  async execute(params: ITaskProjectUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);

    const project = new TaskProjectEntity({
      companyId: params.companyId,
      name: params.name,
      userId: loggedUser.id,
      description: params.description,
    });

    const members = params.members.map(
      ({ userId }) =>
        new TaskProjectMemberEntity({
          userId,
        }),
    );

    const taskAggregate = new TaskProjectAggregate({
      project,
      members,
    });

    await this.taskProjectRepository.create(taskAggregate);
  }
}
