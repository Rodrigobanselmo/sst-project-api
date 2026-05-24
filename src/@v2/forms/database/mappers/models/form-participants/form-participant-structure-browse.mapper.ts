import { FormParticipantStructureBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-participant-structure-browse.model';
import {
  buildParticipantHierarchiesFromSqlRow,
  ParticipantHierarchySqlRow,
} from './build-participant-hierarchies-from-sql-row';

export type IFormParticipantStructureBrowseResultMapper =
  ParticipantHierarchySqlRow & {
    participants_answers_id: string;
    company_id: string | null;
    company_name: string | null;
    workspace_id: string | null;
    workspace_name: string | null;
  };

export class FormParticipantStructureBrowseMapper {
  static toModel(
    row: IFormParticipantStructureBrowseResultMapper,
  ): FormParticipantStructureBrowseModel {
    return new FormParticipantStructureBrowseModel({
      participantsAnswersId: row.participants_answers_id,
      companyId: row.company_id ?? null,
      companyName: row.company_name ?? null,
      workspaceId: row.workspace_id ?? null,
      workspaceName: row.workspace_name ?? null,
      hierarchies: buildParticipantHierarchiesFromSqlRow(row),
    });
  }

  static toModels(
    rows: IFormParticipantStructureBrowseResultMapper[],
  ): FormParticipantStructureBrowseModel[] {
    return rows.map((row) => FormParticipantStructureBrowseMapper.toModel(row));
  }
}
