import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRecMedDto } from '../../../dto/rec-med.dto';
import { RecMedRepository } from '../../../repositories/implementations/RecMedRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { SyncMissingDerivedMeasureAfterRecMedUpdateService } from '../sync-missing-derived-measure-after-rec-med-update/sync-missing-derived-measure-after-rec-med-update.service';

@Injectable()
export class UpdateRecMedService {
  constructor(
    private readonly recMedRepository: RecMedRepository,
    private readonly syncMissingDerivedMeasureAfterRecMedUpdate: SyncMissingDerivedMeasureAfterRecMedUpdateService,
  ) {}

  async execute(id: string, updateRecMedDto: UpdateRecMedDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;

    const risk = await this.recMedRepository.update(
      {
        id,
        ...updateRecMedDto,
      },
      companyId,
    );

    if (!risk.id) throw new NotFoundException('data not found');

    if (updateRecMedDto.recType != null) {
      await this.syncMissingDerivedMeasureAfterRecMedUpdate.execute(id, companyId);
    }

    return risk;
  }
}
