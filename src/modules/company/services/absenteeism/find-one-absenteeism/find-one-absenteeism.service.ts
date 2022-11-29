import { FindAbsenteeismDto } from '../../../dto/absenteeism.dto';
import { AbsenteeismRepository } from '../../../repositories/implementations/AbsenteeismRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindOneAbsenteeismsService {
  constructor(private readonly absenteeismRepository: AbsenteeismRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const access = await this.absenteeismRepository.findById({ companyId: user.targetCompanyId, id });

    return access;
  }
}
