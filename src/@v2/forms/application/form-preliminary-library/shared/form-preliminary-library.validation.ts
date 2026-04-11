import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { FormIdentifierTypeEnum, FormPreliminaryLibraryQuestionTypeEnum } from '@prisma/client';

/** Regra: system global => sem empresa; template de empresa => company_id obrigatório. */
export function assertValidSystemCompanyPair(system: boolean, companyId: string | null): void {
  if (system && companyId !== null) {
    throw new BadRequestException('Template global (system) deve ter company_id nulo.');
  }
  if (!system && (companyId === null || companyId === '')) {
    throw new BadRequestException('Template da empresa requer company_id.');
  }
}

export function rejectSectorIdentifierForLibrary(identifierType: FormIdentifierTypeEnum): void {
  if (identifierType === FormIdentifierTypeEnum.SECTOR) {
    throw new BadRequestException(
      'O tipo de identificador SECTOR não é permitido na biblioteca de perguntas preliminares.',
    );
  }
}

export function assertMutableByCompany(system: boolean): void {
  if (system) {
    throw new ForbiddenException('Templates globais do sistema não podem ser alterados por esta rota.');
  }
}

/** Exclusão de item de catálogo global: só master ({@link UserContext.isAdmin}). */
export function assertSystemItemDeletableByUser(system: boolean, isAdmin: boolean): void {
  if (system && !isAdmin) {
    throw new ForbiddenException('Templates globais do sistema só podem ser excluídos por usuário master.');
  }
}

export function validateOptionsForQuestionType(
  questionType: FormPreliminaryLibraryQuestionTypeEnum,
  identifierType: FormIdentifierTypeEnum,
  options: { text: string; order: number; value?: number | null }[],
): void {
  if (questionType === FormPreliminaryLibraryQuestionTypeEnum.TEXT) {
    if (options.length > 0) {
      throw new BadRequestException('Perguntas do tipo TEXT não devem ter opções na biblioteca (V1).');
    }
    return;
  }
  if (questionType === FormPreliminaryLibraryQuestionTypeEnum.SINGLE_CHOICE) {
    if (identifierType === FormIdentifierTypeEnum.CUSTOM && options.length < 2) {
      throw new BadRequestException('Escolha única (CUSTOM) exige pelo menos duas opções.');
    }
  }
}
