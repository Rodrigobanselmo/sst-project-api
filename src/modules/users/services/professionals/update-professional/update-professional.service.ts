import { ErrorMessageEnum } from './../../../../../shared/constants/enum/errorMessage';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateProfessionalDto } from '../../../dto/professional.dto';
import { ProfessionalRepository } from '../../../repositories/implementations/ProfessionalRepository';

@Injectable()
export class UpdateProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}

  async execute(
    { ...updateDataDto }: UpdateProfessionalDto,
    user: UserPayloadDto,
  ) {
    if (!user.isMaster) {
      const foundProfessional = await this.professionalRepository.findFirstNude(
        {
          where: {
            AND: [
              { id: updateDataDto.id },
              {
                OR: [
                  {
                    user: {
                      companies: {
                        some: {
                          companyId: {
                            in: [user.companyId, user.targetCompanyId],
                          },
                        },
                      },
                    },
                  },
                  { companyId: { in: [user.companyId, user.targetCompanyId] } },
                ],
              },
            ],
          },
          include: { user: { include: { companies: true } } },
        },
      );

      if (!foundProfessional?.id) {
        throw new ForbiddenException(ErrorMessageEnum.PROFESSIONAL_NOT_FOUND);
      }
    }

    const professional = await this.professionalRepository.update(
      updateDataDto,
    );

    return professional;
  }
}
