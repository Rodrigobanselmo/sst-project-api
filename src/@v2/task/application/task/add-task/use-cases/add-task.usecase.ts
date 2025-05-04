import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { TaskActionPlanRepository } from '@/@v2/task/database/repositories/task-action-plan/task-action-plan.repository';
import { TaskProjectRepository } from '@/@v2/task/database/repositories/task-project/task-project.repository';
import { TaskAggregateRepository } from '@/@v2/task/database/repositories/task/task-aggregate.repository';
import { TaskAggregate } from '@/@v2/task/domain/aggregations/task.aggregate';
import { TaskResponsibleEntity } from '@/@v2/task/domain/entities/task-responsible.entity';
import { TaskEntity } from '@/@v2/task/domain/entities/task.entity';
import { CreateTaskPhotosService } from '@/@v2/task/services/create-task-photos/create-task-photos.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ITaskUseCase } from './add-task.types';

@Injectable()
export class AddTaskUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly taskRepository: TaskAggregateRepository,
    private readonly taskActionPlanRepository: TaskActionPlanRepository,
    private readonly taskProjectRepository: TaskProjectRepository,
    private readonly createTaskPhotosService: CreateTaskPhotosService,
  ) {}

  async execute(params: ITaskUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);

    const { actionPlan, project, photos, responsible } = await this.relatedEntities(params);

    if (!actionPlan && params.actionPlan) {
      throw new BadRequestException('Plano de ação não encontrado');
    }

    if (!project && params.projectId) {
      throw new BadRequestException('Projeto não encontrado');
    }

    const task = new TaskEntity({
      companyId: params.companyId,
      creatorId: loggedUser.id,
      description: params.description,
      statusId: params.statusId,
      doneDate: params.doneDate,
      endDate: params.endDate,
    });

    const taskAggregate = new TaskAggregate({
      task,
      actionPlan,
      project,
      responsible,
      photos,
      history: [],
    });

    await this.taskRepository.create(taskAggregate);
  }

  private async relatedEntities(params: ITaskUseCase.Params) {
    const actionPlanPromise = params.actionPlan ? this.taskActionPlanRepository.find({ ...params.actionPlan, companyId: params.companyId }) : null;
    const projectPromise = params.projectId ? this.taskProjectRepository.find({ id: params.projectId, companyId: params.companyId }) : null;
    const photosPromise = this.createTaskPhotosService.create(params);
    const responsible = this.createTaskResponsible(params);

    const [actionPlan, project, photos] = await Promise.all([actionPlanPromise, projectPromise, photosPromise]);

    return {
      actionPlan,
      project,
      photos,
      responsible,
    };
  }

  private createTaskResponsible(params: ITaskUseCase.Params): TaskResponsibleEntity[] {
    return (
      params.responsible?.map(
        (responsible) =>
          new TaskResponsibleEntity({
            userId: responsible.userId,
          }),
      ) || []
    );
  }
}
