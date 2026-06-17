import { describe, expect, it } from '@jest/globals';

import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';
import {
  filterAttachmentsForProfile,
  formatAnnexSubcoverLine,
  getPgrAnnexKind,
  getPgrConsolidatedTypeLabel,
  parsePgrAnnexProfile,
  PGR_ANNEX_PROFILE_KINDS,
} from './pgr-annex-catalog.util';

describe('pgr-annex-catalog.util', () => {
  const functionAttachment = new AttachmentModel({
    type: 'PGR-APR',
    name: 'Inventário de Risco por Função',
    link: 'https://example.com/1',
  });

  const functionSplitAttachment = new AttachmentModel({
    type: 'PGR-APR-Setor_A',
    name: 'Inventário de Risco por Função (Setor A)',
    link: 'https://example.com/2',
  });

  const gseAttachment = new AttachmentModel({
    type: 'PGR-APR-GSE',
    name: 'Inventário de Risco por GSE',
    link: 'https://example.com/3',
  });

  const actionPlanAttachment = new AttachmentModel({
    type: 'PGR-PLANO_DE_ACAO',
    name: 'Plano de Ação Detalhado',
    link: 'https://example.com/4',
  });

  const allAttachments = [
    functionAttachment,
    functionSplitAttachment,
    gseAttachment,
    actionPlanAttachment,
  ];

  it('identifica kinds de anexo pelo type', () => {
    expect(getPgrAnnexKind(functionAttachment)).toBe('function');
    expect(getPgrAnnexKind(functionSplitAttachment)).toBe('function');
    expect(getPgrAnnexKind(gseAttachment)).toBe('gse');
    expect(getPgrAnnexKind(actionPlanAttachment)).toBe('action_plan');
  });

  it('filtra anexos do perfil full mantendo ordem canônica', () => {
    expect(filterAttachmentsForProfile(allAttachments, 'full')).toEqual(
      allAttachments,
    );
  });

  it('filtra anexos do perfil essential excluindo todos os de função', () => {
    expect(filterAttachmentsForProfile(allAttachments, 'essential')).toEqual([
      gseAttachment,
      actionPlanAttachment,
    ]);
  });

  it('numera subcapas dinamicamente', () => {
    expect(
      formatAnnexSubcoverLine(1, 'INVENTÁRIO DE RISCO POR GSE'),
    ).toBe('ANEXO 01 — INVENTÁRIO DE RISCO POR GSE');
    expect(formatAnnexSubcoverLine(2, 'PLANO DE AÇÃO DETALHADO')).toBe(
      'ANEXO 02 — PLANO DE AÇÃO DETALHADO',
    );
  });

  it('define kinds por perfil', () => {
    expect(PGR_ANNEX_PROFILE_KINDS.full).toEqual([
      'function',
      'gse',
      'action_plan',
    ]);
    expect(PGR_ANNEX_PROFILE_KINDS.essential).toEqual(['gse', 'action_plan']);
  });

  it('resolve label de arquivo consolidado por perfil', () => {
    expect(getPgrConsolidatedTypeLabel('full', 'PGR')).toBe('PGR-COMPLETO');
    expect(getPgrConsolidatedTypeLabel('essential', 'PGR')).toBe(
      'PGR-ESSENCIAL',
    );
  });

  it('faz parse seguro do profile', () => {
    expect(parsePgrAnnexProfile('essential')).toBe('essential');
    expect(parsePgrAnnexProfile('full')).toBe('full');
    expect(parsePgrAnnexProfile(undefined)).toBe('full');
    expect(parsePgrAnnexProfile('invalid')).toBe('full');
  });
});
