import { ESocialBatchRepository } from './../../../../repositories/implementations/ESocialBatchRepository';
import { FindESocialBatchDto } from './../../../../dto/esocial-batch.dto';
import { UserPayloadDto } from './../../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindESocialBatchService {
  constructor(private readonly eSocialBatchRepository: ESocialBatchRepository) {}

  async execute({ skip, take, ...query }: FindESocialBatchDto, user: UserPayloadDto) {
    const employees = await this.eSocialBatchRepository.find(
      { ...query, companyId: user.targetCompanyId },
      { skip, take },
    );

    return employees;
  }
}
