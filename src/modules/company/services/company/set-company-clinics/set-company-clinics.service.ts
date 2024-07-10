import { ForbiddenException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { SetCompanyClinicDto } from './../../../dto/company-clinic.dto';
import { CompanyClinicRepository } from './../../../repositories/implementations/CompanyClinicRepository';

@Injectable()
export class SetCompanyClinicsService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly companyClinicRepository: CompanyClinicRepository,
  ) {}
  async execute(setCompanyClinicDto: SetCompanyClinicDto, user: UserPayloadDto) {
    if (!setCompanyClinicDto.ids.every((c) => c.companyId === user.targetCompanyId))
      throw new ForbiddenException(ErrorMessageEnum.FORBIDDEN_ACCESS);

    await this.companyClinicRepository.set(setCompanyClinicDto, user.targetCompanyId);

    return { companyId: user.targetCompanyId };
  }
}
