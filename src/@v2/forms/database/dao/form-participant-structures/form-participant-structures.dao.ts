import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { participantWorkspaceLateralJoin } from '../form-participants/participant-workspace-lateral.sql';
import {
  FormParticipantStructureBrowseMapper,
  IFormParticipantStructureBrowseResultMapper,
} from '../../mappers/models/form-participants/form-participant-structure-browse.mapper';
import { FormParticipantStructureBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-participant-structure-browse.model';

@Injectable()
export class FormParticipantStructuresDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  /**
   * Estrutura organizacional por submissão (FormParticipantsAnswers.id),
   * alinhada ao browse de participantes quando há employee_id.
   */
  async findByParticipantsAnswersIds(params: {
    companyId: string;
    formApplicationId: string;
    participantsAnswersIds: string[];
  }): Promise<FormParticipantStructureBrowseModel[]> {
    const { companyId, formApplicationId, participantsAnswersIds } = params;
    if (participantsAnswersIds.length === 0) return [];

    const rows = await this.prisma.$queryRaw<
      IFormParticipantStructureBrowseResultMapper[]
    >`
      SELECT
        fpa."id" AS participants_answers_id,
        participant_ws.workspace_id,
        participant_ws.workspace_name,
        hier."id" AS hierarchy_id,
        hier."name" AS hierarchy_name,
        hier."type" AS hierarchy_type,
        h_parent_1."id" AS h_parent_1_id,
        h_parent_1."name" AS h_parent_1_name,
        h_parent_1."type" AS h_parent_1_type,
        h_parent_2."id" AS h_parent_2_id,
        h_parent_2."name" AS h_parent_2_name,
        h_parent_2."type" AS h_parent_2_type,
        h_parent_3."id" AS h_parent_3_id,
        h_parent_3."name" AS h_parent_3_name,
        h_parent_3."type" AS h_parent_3_type,
        h_parent_4."id" AS h_parent_4_id,
        h_parent_4."name" AS h_parent_4_name,
        h_parent_4."type" AS h_parent_4_type,
        h_parent_5."id" AS h_parent_5_id,
        h_parent_5."name" AS h_parent_5_name,
        h_parent_5."type" AS h_parent_5_type
      FROM "FormParticipantsAnswers" fpa
      LEFT JOIN "Employee" emp
        ON emp."id" = fpa."employee_id"
        AND emp."companyId" = ${companyId}
      LEFT JOIN "Hierarchy" hier ON hier."id" = emp."hierarchyId"
      LEFT JOIN "Hierarchy" h_parent_1 ON h_parent_1."id" = hier."parentId"
      LEFT JOIN "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
      LEFT JOIN "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
      LEFT JOIN "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
      LEFT JOIN "Hierarchy" h_parent_5 ON h_parent_5."id" = h_parent_4."parentId"
      ${participantWorkspaceLateralJoin(formApplicationId)}
      WHERE fpa."form_application_id" = ${formApplicationId}
        AND fpa."id" IN (${Prisma.join(participantsAnswersIds)})
    `;

    return FormParticipantStructureBrowseMapper.toModels(rows);
  }

  /**
   * Cadeia hierárquica a partir de um nó (ex.: answer.value em pergunta SYSTEM/setor
   * quando não há employee_id na submissão).
   */
  async findHierarchyChainByHierarchyId(params: {
    hierarchyId: string;
  }): Promise<FormParticipantStructureBrowseModel['hierarchies']> {
    const { hierarchyId } = params;
    const rows = await this.prisma.$queryRaw<
      IFormParticipantStructureBrowseResultMapper[]
    >`
      SELECT
        ${hierarchyId}::text AS participants_answers_id,
        NULL::text AS workspace_id,
        NULL::text AS workspace_name,
        hier."id" AS hierarchy_id,
        hier."name" AS hierarchy_name,
        hier."type" AS hierarchy_type,
        h_parent_1."id" AS h_parent_1_id,
        h_parent_1."name" AS h_parent_1_name,
        h_parent_1."type" AS h_parent_1_type,
        h_parent_2."id" AS h_parent_2_id,
        h_parent_2."name" AS h_parent_2_name,
        h_parent_2."type" AS h_parent_2_type,
        h_parent_3."id" AS h_parent_3_id,
        h_parent_3."name" AS h_parent_3_name,
        h_parent_3."type" AS h_parent_3_type,
        h_parent_4."id" AS h_parent_4_id,
        h_parent_4."name" AS h_parent_4_name,
        h_parent_4."type" AS h_parent_4_type,
        h_parent_5."id" AS h_parent_5_id,
        h_parent_5."name" AS h_parent_5_name,
        h_parent_5."type" AS h_parent_5_type
      FROM "Hierarchy" hier
      LEFT JOIN "Hierarchy" h_parent_1 ON h_parent_1."id" = hier."parentId"
      LEFT JOIN "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
      LEFT JOIN "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
      LEFT JOIN "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
      LEFT JOIN "Hierarchy" h_parent_5 ON h_parent_5."id" = h_parent_4."parentId"
      WHERE hier."id" = ${hierarchyId}
      LIMIT 1
    `;

    if (!rows.length) return [];
    return FormParticipantStructureBrowseMapper.toModel(rows[0]).hierarchies;
  }
}
