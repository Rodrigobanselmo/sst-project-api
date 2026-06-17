import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';

export type PgrAnnexKind = 'function' | 'gse' | 'action_plan';

export type PgrAnnexProfile = 'full' | 'essential';

export const DEFAULT_PGR_ANNEX_PROFILE: PgrAnnexProfile = 'full';

export type PgrAnnexCatalogEntry = {
  kind: PgrAnnexKind;
  listName: string;
  subcoverTitle: string;
};

/** Ordem canônica dos anexos no PGR (antes da renumeração por perfil). */
export const PGR_ANNEX_CATALOG: ReadonlyArray<PgrAnnexCatalogEntry> = [
  {
    kind: 'function',
    listName: 'Inventário de Risco por Função',
    subcoverTitle: 'INVENTÁRIO DE RISCO POR FUNÇÃO',
  },
  {
    kind: 'gse',
    listName: 'Inventário de Risco por GSE',
    subcoverTitle: 'INVENTÁRIO DE RISCO POR GSE',
  },
  {
    kind: 'action_plan',
    listName: 'Plano de Ação Detalhado',
    subcoverTitle: 'PLANO DE AÇÃO DETALHADO',
  },
];

export const PGR_ANNEX_PROFILE_KINDS: Record<PgrAnnexProfile, PgrAnnexKind[]> = {
  full: ['function', 'gse', 'action_plan'],
  essential: ['gse', 'action_plan'],
};

const PGR_ANNEX_CATALOG_BY_KIND = new Map<PgrAnnexKind, PgrAnnexCatalogEntry>(
  PGR_ANNEX_CATALOG.map((entry) => [entry.kind, entry]),
);

export function getPgrAnnexCatalogEntry(kind: PgrAnnexKind): PgrAnnexCatalogEntry {
  const entry = PGR_ANNEX_CATALOG_BY_KIND.get(kind);
  if (!entry) {
    throw new Error(`Entrada de catálogo PGR não encontrada para kind=${kind}`);
  }
  return entry;
}

export function formatAnnexSubcoverLine(
  annexNumber: number,
  title: string,
): string {
  const padded = String(annexNumber).padStart(2, '0');
  return `ANEXO ${padded} — ${title}`;
}

export function getPgrAnnexKind(attachment: AttachmentModel): PgrAnnexKind | null {
  if (attachment.type === 'PGR-APR-GSE') return 'gse';
  if (attachment.type === 'PGR-PLANO_DE_ACAO') return 'action_plan';
  if (attachment.type === 'PGR-APR' || attachment.type.startsWith('PGR-APR-')) {
    return 'function';
  }
  return null;
}

/**
 * Filtra anexos conforme o perfil consolidado, preservando a ordem canônica
 * Função → GSE → Plano de Ação.
 */
export function filterAttachmentsForProfile(
  attachments: AttachmentModel[],
  profile: PgrAnnexProfile,
): AttachmentModel[] {
  const allowedKinds = new Set(PGR_ANNEX_PROFILE_KINDS[profile]);

  return attachments.filter((attachment) => {
    const kind = getPgrAnnexKind(attachment);
    return kind !== null && allowedKinds.has(kind);
  });
}

export function getPgrConsolidatedTypeLabel(
  profile: PgrAnnexProfile,
  documentPrefix: 'PGR' | 'FRPS',
): string {
  if (profile === 'essential') return `${documentPrefix}-ESSENCIAL`;
  return `${documentPrefix}-COMPLETO`;
}

export function parsePgrAnnexProfile(value?: string | null): PgrAnnexProfile {
  if (value === 'essential') return 'essential';
  return DEFAULT_PGR_ANNEX_PROFILE;
}
