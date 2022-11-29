import { FindAbsenteeismDto } from '../../../dto/absenteeism.dto';
import { AbsenteeismRepository } from '../../../repositories/implementations/AbsenteeismRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAbsenteeismsService {
  constructor(private readonly absenteeismRepository: AbsenteeismRepository) {}

  async execute({ skip, take, ...query }: FindAbsenteeismDto, user: UserPayloadDto) {
    const access = await this.absenteeismRepository.find({ companyId: user.targetCompanyId, ...query }, { skip, take });

    return access;
  }
}
