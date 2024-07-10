import { FindUserHistoryDto } from './../../../dto/user-history.dto';
import { UserHistoryRepository } from '../../../repositories/implementations/UserHistoryRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindUserHistorysService {
  constructor(private readonly userHistoryRepository: UserHistoryRepository) {}

  async execute({ skip, take, ...query }: FindUserHistoryDto, user: UserPayloadDto) {
    const access = await this.userHistoryRepository.findAllByCompany(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
    );

    return access;
  }
}
