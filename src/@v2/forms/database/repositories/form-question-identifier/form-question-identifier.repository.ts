import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { FormQuestionIdentifierEntityMapper } from '../../mappers/entities/form-question-identifier.mapper';
import { IFormQuestionIdentifierEntityRepository } from './form-question-identifier.types';
import { Prisma } from '@prisma/client';

// RELOAD
@Injectable()
export class FormQuestionIdentifierEntityRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {} satisfies Prisma.FormQuestionIdentifierFindFirstArgs['include'];

    return { include };
  }

  async find(params: IFormQuestionIdentifierEntityRepository.FindParams): IFormQuestionIdentifierEntityRepository.FindReturn {
    const FormQuestionIdentifier = await this.prisma.formQuestionIdentifier.findFirst({
      where: {
        type: params.type,
        system: true,
      },
      ...FormQuestionIdentifierEntityRepository.selectOptions(),
    });

    return FormQuestionIdentifier ? FormQuestionIdentifierEntityMapper.toEntity(FormQuestionIdentifier) : null;
  }
}
