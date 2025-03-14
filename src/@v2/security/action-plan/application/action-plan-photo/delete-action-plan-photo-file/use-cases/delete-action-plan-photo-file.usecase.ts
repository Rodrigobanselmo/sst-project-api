import { ActionPlanPhotoAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-photo/action-plan-photo-aggregate.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IUseCase } from './delete-action-plan-photo-file.types';

@Injectable()
export class DeleteActionPlanPhotoFileUseCase {
  constructor(private readonly actionPlanPhotoRepository: ActionPlanPhotoAggregateRepository) {}

  async execute(params: IUseCase.Params) {
    const actionPlanPhoto = await this.actionPlanPhotoRepository.find({
      companyId: params.companyId,
      id: params.id,
    });

    if (!actionPlanPhoto) throw new BadRequestException('Foto não encontrada');

    await this.actionPlanPhotoRepository.inactivate(actionPlanPhoto);
  }
}
