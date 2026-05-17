import { Prisma } from '@prisma/client';

/**
 * Estabelecimento (workspace) do participante no escopo da aplicação.
 * LATERAL garante uma linha por employee sem multiplicar o DISTINCT da listagem.
 *
 * Prioridade:
 * 1) Workspace explícito em FormParticipantsWorkspace com vínculo _HierarchyToWorkspace no cargo.
 * 2) Participação por hierarquia: workspace do cargo entre os workspaces da aplicação.
 *
 * Empate (vários workspaces): menor nome (pt-BR), depois menor id.
 *
 * @param employeeAlias SQL identifier do alias Employee na query (ex.: emp)
 */
export function participantWorkspaceLateralJoin(
  applicationId: string,
  employeeAlias = 'emp',
): Prisma.Sql {
  const emp = Prisma.raw(employeeAlias);
  return Prisma.sql`
    LEFT JOIN LATERAL (
      SELECT picked.workspace_id, picked.workspace_name
      FROM (
        SELECT ws.id AS workspace_id, ws.name AS workspace_name, 1 AS prio
        FROM "FormParticipants" fp
        INNER JOIN "FormParticipantsWorkspace" fpw ON fpw.form_participants_id = fp.id
        INNER JOIN "_HierarchyToWorkspace" htw
          ON htw."B" = fpw.workspace_id AND htw."A" = ${emp}."hierarchyId"
        INNER JOIN "Workspace" ws ON ws.id = fpw.workspace_id AND ws.deleted_at IS NULL
        WHERE fp.form_application_id = ${applicationId}

        UNION ALL

        SELECT ws.id, ws.name, 2 AS prio
        FROM "FormParticipants" fp
        INNER JOIN "FormParticipantsHierarchy" fph
          ON fph.form_participants_id = fp.id AND fph.hierarchy_id = ${emp}."hierarchyId"
        INNER JOIN "_HierarchyToWorkspace" htw ON htw."A" = ${emp}."hierarchyId"
        INNER JOIN "FormParticipantsWorkspace" fpw
          ON fpw.form_participants_id = fp.id AND fpw.workspace_id = htw."B"
        INNER JOIN "Workspace" ws ON ws.id = htw."B" AND ws.deleted_at IS NULL
        WHERE fp.form_application_id = ${applicationId}
      ) picked
      ORDER BY picked.prio ASC, picked.workspace_name ASC, picked.workspace_id ASC
      LIMIT 1
    ) participant_ws ON TRUE
  `;
}
