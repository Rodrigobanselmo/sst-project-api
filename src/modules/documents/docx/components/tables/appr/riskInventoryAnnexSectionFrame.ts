import { sectionTitleOnlyHeadersFooters } from '../../../base/layouts/annex/sectionTitleOnlyHeadersFooters';

/** Anexo 01 — inventário por cargo/função (cabeçalho da seção). */
export const RISK_INVENTORY_ANNEX_HEADER_BY_JOB =
  'INVENTÁRIO DE RISCO POR FUNÇÃO — Programa de Gerenciamento de Riscos (PGR)';

/** Anexo 02 — inventário por GSE (cabeçalho da seção). */
export const RISK_INVENTORY_ANNEX_HEADER_BY_GSE =
  'INVENTÁRIO DE RISCO POR GSE — Programa de Gerenciamento de Riscos (PGR)';

export const riskInventoryAnnexByJobHeadersFooters = () =>
  sectionTitleOnlyHeadersFooters(RISK_INVENTORY_ANNEX_HEADER_BY_JOB);

export const riskInventoryAnnexByGseHeadersFooters = () =>
  sectionTitleOnlyHeadersFooters(RISK_INVENTORY_ANNEX_HEADER_BY_GSE);
