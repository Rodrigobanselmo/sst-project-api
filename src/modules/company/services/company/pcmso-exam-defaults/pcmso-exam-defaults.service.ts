import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../prisma/prisma.service';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import {
  PCMSO_EXAM_DEFAULTS_FIELDS,
  PCMSO_EXAM_DEFAULTS_METADATA_KEY,
  PcmsoExamDefaultsDto,
} from '../../../dto/pcmso-exam-defaults.dto';

@Injectable()
export class PcmsoExamDefaultsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lê os padrões de PCMSO da empresa a partir de Company.metadata. Retorna
   * objeto vazio quando a empresa nunca configurou — o Client preserva o
   * comportamento atual nesse caso.
   */
  async get(user: UserPayloadDto): Promise<PcmsoExamDefaultsDto> {
    const companyId = user.targetCompanyId;
    if (!companyId) throw new BadRequestException('Empresa não informada');

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { metadata: true },
    });

    const metadata = (company?.metadata as Record<string, unknown> | null) ?? {};
    const stored = (metadata[PCMSO_EXAM_DEFAULTS_METADATA_KEY] as
      | Record<string, unknown>
      | undefined) ?? {};

    return this.pick(stored);
  }

  /**
   * Grava os padrões fazendo MERGE em Company.metadata: preserva todas as outras
   * chaves do metadata e substitui apenas pcmsoExamDefaults. Não altera nenhum
   * vínculo ExamToRisk existente.
   */
  async update(
    dto: PcmsoExamDefaultsDto,
    user: UserPayloadDto,
  ): Promise<PcmsoExamDefaultsDto> {
    const companyId = user.targetCompanyId;
    if (!companyId) throw new BadRequestException('Empresa não informada');

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { metadata: true },
    });
    if (!company) throw new BadRequestException('Empresa não encontrada');

    const currentMetadata =
      (company.metadata as Record<string, unknown> | null) ?? {};

    const defaults = this.pick(dto as Record<string, unknown>);

    const mergedMetadata = {
      ...currentMetadata,
      [PCMSO_EXAM_DEFAULTS_METADATA_KEY]: defaults,
    };

    await this.prisma.company.update({
      where: { id: companyId },
      data: { metadata: mergedMetadata as unknown as Prisma.InputJsonValue },
    });

    return defaults;
  }

  /**
   * Mantém apenas as chaves conhecidas dos defaults, descartando campos
   * indesejados que por ventura cheguem no payload ou estejam no metadata.
   */
  private pick(source: Record<string, unknown>): PcmsoExamDefaultsDto {
    const result: Record<string, unknown> = {};

    PCMSO_EXAM_DEFAULTS_FIELDS.forEach((field) => {
      if (source[field] !== undefined) {
        result[field] = source[field];
      }
    });

    return result as PcmsoExamDefaultsDto;
  }
}
