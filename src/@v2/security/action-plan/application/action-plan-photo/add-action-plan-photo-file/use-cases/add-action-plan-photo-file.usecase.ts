import { BUCKET_FOLDERS } from '@/@v2/shared/constants/buckets';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { IFileRequester } from '@/@v2/shared/requesters/files/file.interface';
import { getFileName } from '@/@v2/shared/utils/file/get-file-name';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUseCase } from './add-action-plan-photo-file.types';
import { ActionPlanPhotoAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-photo/action-plan-photo-aggregate.repository';
import { ActionPlanPhotoEntity } from '@/@v2/security/action-plan/domain/entities/action-plan-photo.entity';
import { getImageSize } from '@/@v2/shared/utils/helpers/get-image-size';
import { ActionPlanAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan/action-plan-aggregate.repository';
import { ActionPlanPhotoAggregate } from '@/@v2/security/action-plan/domain/aggregations/action-plan-photo.aggregate';

@Injectable()
export class AddActionPlanPhotoFileUseCase {
  constructor(
    @Inject(SharedTokens.FileRequester)
    private readonly fileRequester: IFileRequester,
    private readonly actionPlanPhotoRepository: ActionPlanPhotoAggregateRepository,
    private readonly actionPlanAggregateRepository: ActionPlanAggregateRepository,
  ) {}

  async execute(params: IUseCase.Params) {
    const [file, error] = await this.fileRequester.add({
      buffer: params.buffer,
      fileName: getFileName(params.name),
      companyId: params.companyId,
      fileFolder: BUCKET_FOLDERS.ACTION_PLAN_RECOMMENDATION,
      shouldDelete: false,
      size: params.size,
      isPublic: true,
    });

    if (error || !file) throw new BadRequestException('Não foi possível adicionar o arquivo');

    const actionPlanAggregate = await this.actionPlanAggregateRepository.findById({
      companyId: params.companyId,
      workspaceId: params.workspaceId,
      recommendationId: params.recommendationId,
      riskDataId: params.riskDataId,
    });

    if (!actionPlanAggregate) throw new BadRequestException('Não foi possível encintrar a recomendação');

    const { isVertical } = getImageSize(params.buffer);

    const photo = new ActionPlanPhotoEntity({ file, isVertical });

    const actionPlanPhoto = new ActionPlanPhotoAggregate({
      photo,
      actionPlan: actionPlanAggregate.actionPlan,
    });

    await this.actionPlanPhotoRepository.create(actionPlanPhoto);
  }
}
