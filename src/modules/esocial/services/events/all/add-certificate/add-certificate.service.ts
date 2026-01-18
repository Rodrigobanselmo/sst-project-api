import { CompanyCertRepository } from './../../../../repositories/implementations/CompanyCertRepository';
import { AddCertDto } from './../../../../dto/add-cert.dto';
import { UserPayloadDto } from './../../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';

@Injectable()
export class AddCertificationESocialService {
  constructor(
    private readonly companyCertRepository: CompanyCertRepository,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
  ) {}

  async execute(file: any, { password }: AddCertDto, user: UserPayloadDto) {
    const convertedPem = await this.eSocialMethodsProvider.convertPfxToPem({
      file,
      password,
    });

    await this.companyCertRepository.upsert({
      ...convertedPem,
      companyId: user.targetCompanyId,
    });

    return;
  }
}
