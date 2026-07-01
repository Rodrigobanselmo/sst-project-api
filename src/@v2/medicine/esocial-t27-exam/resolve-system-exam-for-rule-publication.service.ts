import { Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { simpleCompanyId } from '@/shared/constants/ids';

import {
  buildExamCatalogWhere,
  isSystemicCatalogExam,
} from '../biological-indicator/biological-indicator-exam-provision.util';
import {
  ExamForRulePublicationSnapshot,
  findGlobalEquivalentInCatalog,
  SystemExamPublicationAction,
} from './resolve-system-exam-for-rule-publication.util';

export type ResolveSystemExamForRulePublicationResult = {
  systemExamId: number;
  systemExamName: string;
  esocial27Code: string | null;
  action: SystemExamPublicationAction;
};

const examSelect = {
  id: true,
  name: true,
  companyId: true,
  system: true,
  status: true,
  type: true,
  material: true,
  analyses: true,
  instruction: true,
  esocial27Code: true,
  isAttendance: true,
  isAvaliation: true,
  obsProc: true,
} as const;

@Injectable()
export class ResolveSystemExamForRulePublicationService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(examId: number): Promise<ResolveSystemExamForRulePublicationResult | null> {
    const source = await this.prisma.exam.findFirst({
      where: { id: examId, deleted_at: null },
      select: examSelect,
    });

    if (!source) return null;

    if (isSystemicCatalogExam(source)) {
      return {
        systemExamId: source.id,
        systemExamName: source.name,
        esocial27Code: source.esocial27Code,
        action: 'same',
      };
    }

    const equivalent = await this.findGlobalEquivalent(source);
    if (equivalent) {
      return {
        systemExamId: equivalent.id,
        systemExamName: equivalent.name,
        esocial27Code: equivalent.esocial27Code,
        action: 'reusedGlobal',
      };
    }

    const created = await this.createGlobalClone(source);
    return {
      systemExamId: created.id,
      systemExamName: created.name,
      esocial27Code: created.esocial27Code,
      action: 'createdGlobal',
    };
  }

  private async findGlobalEquivalent(
    source: ExamForRulePublicationSnapshot,
  ): Promise<ExamForRulePublicationSnapshot | null> {
    const trimmedCode = source.esocial27Code?.trim();
    if (trimmedCode) {
      return this.prisma.exam.findFirst({
        where: {
          deleted_at: null,
          status: StatusEnum.ACTIVE,
          system: true,
          companyId: simpleCompanyId,
          esocial27Code: trimmedCode,
        },
        select: examSelect,
      });
    }

    const globals = await this.prisma.exam.findMany({
      where: {
        deleted_at: null,
        status: StatusEnum.ACTIVE,
        system: true,
        companyId: simpleCompanyId,
        type: source.type ?? undefined,
        name: { equals: source.name, mode: 'insensitive' },
      },
      select: examSelect,
    });

    return findGlobalEquivalentInCatalog(source, globals);
  }

  private async createGlobalClone(
    source: ExamForRulePublicationSnapshot,
  ): Promise<ExamForRulePublicationSnapshot> {
    const existingAfterRace = await this.findGlobalEquivalent(source);
    if (existingAfterRace) return existingAfterRace;

    return this.prisma.exam.create({
      data: {
        name: source.name,
        companyId: simpleCompanyId,
        system: true,
        status: StatusEnum.ACTIVE,
        type: source.type,
        material: source.material,
        analyses: source.analyses,
        instruction: source.instruction,
        esocial27Code: source.esocial27Code?.trim() || null,
        isAttendance: source.isAttendance,
        isAvaliation: source.isAvaliation,
        obsProc: source.obsProc,
      },
      select: examSelect,
    });
  }
}

/** Exported for tests — mirrors catalog scope used elsewhere in medicine. */
export const buildGlobalExamCatalogWhere = () =>
  buildExamCatalogWhere(simpleCompanyId);
