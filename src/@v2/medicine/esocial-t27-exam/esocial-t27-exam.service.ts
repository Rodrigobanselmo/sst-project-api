import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExamTypeEnum, StatusEnum } from '@prisma/client';

import { ESocial27TableRepository } from '@/modules/esocial/repositories/implementations/ESocial27TableRepository';
import { PrismaService } from '@/prisma/prisma.service';
import { simpleCompanyId } from '@/shared/constants/ids';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';
import { normalizeAgentName } from '@/shared/utils/agent-normalize.util';
import { isMaster } from '@/shared/utils/isMater';

import {
  ESOCIAL_T27_SEARCH_DEFAULT_LIMIT,
  ESOCIAL_T27_SEARCH_MIN_LENGTH,
  searchEsocialT27Catalog,
} from './esocial-t27-exam.util';

export type MaterializeEsocialT27ExamResult = {
  examId: number;
  examName: string;
  esocial27Code: string;
  created: boolean;
  scope: 'SYSTEM' | 'COMPANY';
  warning?: string;
};

@Injectable()
export class EsocialT27ExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly esocial27TableRepository: ESocial27TableRepository,
  ) {}

  async searchUnpublished(params: {
    search: string;
    limit?: number;
  }) {
    const search = params.search?.trim() ?? '';
    if (search.length < ESOCIAL_T27_SEARCH_MIN_LENGTH) {
      return { items: [] as Array<{ code: string; name: string }> };
    }

    const catalog = await this.esocial27TableRepository.findAll();
    const matches = searchEsocialT27Catalog(
      catalog,
      search,
      params.limit ?? ESOCIAL_T27_SEARCH_DEFAULT_LIMIT,
    );

    if (!matches.length) {
      return { items: [] as Array<{ code: string; name: string }> };
    }

    const codes = matches.map((item) => item.code);
    const materialized = await this.prisma.exam.findMany({
      where: {
        deleted_at: null,
        esocial27Code: { in: codes },
      },
      select: { esocial27Code: true },
    });
    const materializedCodes = new Set(
      materialized
        .map((exam) => exam.esocial27Code)
        .filter((code): code is string => Boolean(code)),
    );

    return {
      items: matches
        .filter((item) => !materializedCodes.has(item.code))
        .map((item) => ({ code: item.code, name: item.name.trim() })),
    };
  }

  async materialize(
    params: {
      esocial27Code: string;
      companyId?: string;
      asSystem?: boolean;
    },
    user: UserPayloadDto,
  ): Promise<MaterializeEsocialT27ExamResult> {
    const code = params.esocial27Code?.trim();
    if (!code) {
      throw new BadRequestException('Código eSocial T27 é obrigatório.');
    }

    const catalog = await this.esocial27TableRepository.findAll();
    const procedure = catalog.find((item) => item.code === code);
    if (!procedure) {
      throw new NotFoundException(
        'Procedimento não encontrado na Tabela 27/eSocial oficial.',
      );
    }

    const officialName = procedure.name.trim();
    const targetCompanyId = params.companyId || user.targetCompanyId;
    const master = isMaster(user, targetCompanyId);
    const wantsSystem = Boolean(params.asSystem);

    if (wantsSystem && !master.isMaster) {
      throw new ForbiddenException(
        'Apenas usuários MASTER podem materializar exame global do sistema.',
      );
    }

    const existingByCode = await this.prisma.exam.findFirst({
      where: { deleted_at: null, esocial27Code: code },
      orderBy: [{ system: 'desc' }, { id: 'asc' }],
    });

    if (existingByCode) {
      const scope =
        existingByCode.system && existingByCode.companyId === simpleCompanyId
          ? 'SYSTEM'
          : 'COMPANY';

      if (!wantsSystem || scope === 'SYSTEM') {
        return {
          examId: existingByCode.id,
          examName: existingByCode.name,
          esocial27Code: code,
          created: false,
          scope,
        };
      }

      if (wantsSystem && scope === 'COMPANY') {
        return {
          examId: existingByCode.id,
          examName: existingByCode.name,
          esocial27Code: code,
          created: false,
          scope,
          warning:
            'Já existe exame com este código eSocial em escopo de empresa; reutilizado sem criar global.',
        };
      }
    }

    const ambiguous = await this.findAmbiguousNameWithoutCode(officialName, code);
    if (ambiguous) {
      throw new BadRequestException(
        `Existe exame "${ambiguous.name}" (id ${ambiguous.id}) com nome semelhante, mas sem código eSocial T27. Revise manualmente antes de materializar.`,
      );
    }

    const createAsSystem = wantsSystem && master.isMaster;
    const companyId = createAsSystem ? simpleCompanyId : targetCompanyId;

    const created = await this.prisma.exam.create({
      data: {
        name: officialName,
        companyId,
        analyses: officialName,
        type: ExamTypeEnum.LAB,
        system: createAsSystem,
        isAttendance: false,
        isAvaliation: false,
        status: StatusEnum.ACTIVE,
        esocial27Code: code,
        obsProc: `Materializado da Tabela 27/eSocial (${code}) por usuário ${user.userId}.`,
      },
    });

    return {
      examId: created.id,
      examName: created.name,
      esocial27Code: code,
      created: true,
      scope: createAsSystem ? 'SYSTEM' : 'COMPANY',
    };
  }

  private async findAmbiguousNameWithoutCode(
    officialName: string,
    code: string,
  ) {
    const normalizedOfficial = normalizeAgentName(officialName);
    if (!normalizedOfficial) return null;

    const candidates = await this.prisma.exam.findMany({
      where: {
        deleted_at: null,
        OR: [{ esocial27Code: null }, { esocial27Code: '' }],
        name: { contains: officialName.slice(0, Math.min(officialName.length, 24)), mode: 'insensitive' },
      },
      take: 20,
      select: { id: true, name: true, esocial27Code: true },
    });

    return (
      candidates.find(
        (exam) => normalizeAgentName(exam.name) === normalizedOfficial,
      ) ?? null
    );
  }
}
