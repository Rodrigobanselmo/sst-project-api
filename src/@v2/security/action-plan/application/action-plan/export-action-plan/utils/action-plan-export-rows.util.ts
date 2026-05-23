import { ActionPlanBrowseResultModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-browse-result.model';
import { IReportRow } from '@/shared/providers/ExcelProvider/models/IExcelProvider.types';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import {
  ActionPlanStatusExportTranslation,
  OccupationalRiskLevelExportTranslation,
  OriginTypeExportTranslation,
} from '../translations/action-plan-export.translation';

const formatDate = (value?: Date | null) =>
  value ? dateUtils(value).format('DD/MM/YYYY') : '';

const formatDateTime = (value?: Date | null) =>
  value ? dateUtils(value).format('DD/MM/YYYY HH:mm') : '';

const formatComments = (item: ActionPlanBrowseResultModel) => {
  if (!item.comments?.length) return '';

  return item.comments
    .map((comment, index) => {
      const createdAt = (comment as { createdAt?: Date }).createdAt;
      const parts = [
        `#${index + 1}`,
        formatDateTime(createdAt),
        comment.type,
        comment.textType || '',
        comment.text || '',
        comment.approvedComment ? `Aprovado: ${comment.approvedComment}` : '',
        comment.isApproved != null ? (comment.isApproved ? 'Sim' : 'Não') : '',
      ].filter(Boolean);

      return parts.join(' | ');
    })
    .join('\n');
};

const cell = (content: string | number, width = 22): IReportRow[0] => ({
  content,
  width,
});

const headerCell = (content: string, width = 22): IReportRow[0] => ({
  content,
  width,
  font: { bold: true },
});

export const ACTION_PLAN_EXPORT_HEADERS: IReportRow = [
  headerCell('ID', 8),
  headerCell('Origem', 28),
  headerCell('Tipo Origem', 22),
  headerCell('Risco', 28),
  headerCell('Tipo Risco', 12),
  headerCell('Subtipos Risco', 24),
  headerCell('Fontes Geradoras', 32),
  headerCell('Nível de Risco', 14),
  headerCell('Recomendação', 36),
  headerCell('Tipo Recomendação', 18),
  headerCell('Status', 14),
  headerCell('Responsável', 22),
  headerCell('Criado em', 12),
  headerCell('Atualizado em', 12),
  headerCell('Iniciado em', 12),
  headerCell('Concluído em', 12),
  headerCell('Cancelado em', 12),
  headerCell('Prazo', 12),
  headerCell('Qtd. Comentários', 14),
  headerCell('Comentários', 48),
  headerCell('ID Risco (dados)', 38),
  headerCell('ID Recomendação', 38),
  headerCell('ID Workspace', 38),
];

export const mapActionPlanToExportRow = (item: ActionPlanBrowseResultModel): IReportRow => [
  cell(item.sequentialId, 8),
  cell(item.origin.name, 28),
  cell(OriginTypeExportTranslation[item.origin.type] ?? item.origin.type, 22),
  cell(item.risk.name, 28),
  cell(item.risk.type, 12),
  cell(item.risk.subTypes?.map((s) => s.name).join(', ') || '', 24),
  cell(item.generateSources.map((s) => s.name).join(', '), 32),
  cell(
    item.ocupationalRisk != null
      ? OccupationalRiskLevelExportTranslation[item.ocupationalRisk] ?? String(item.ocupationalRisk)
      : '-',
    14,
  ),
  cell(item.recommendation.name, 36),
  cell(item.recommendation.type, 18),
  cell(ActionPlanStatusExportTranslation[item.status] ?? item.status, 14),
  cell(item.responsible?.name ?? '', 22),
  cell(formatDate(item.createdAt), 12),
  cell(formatDate(item.updatedAt), 12),
  cell(formatDate(item.startDate), 12),
  cell(formatDate(item.doneDate), 12),
  cell(formatDate(item.canceledDate), 12),
  cell(formatDate(item.validDate), 12),
  cell(item.comments?.length ?? 0, 14),
  cell(formatComments(item), 48),
  cell(item.uuid.riskDataId, 38),
  cell(item.uuid.recommendationId, 38),
  cell(item.uuid.workspaceId, 38),
];
