import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormParticipantStructureBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-participant-structure-browse.model';
import { FormQuestionGroupWithAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-question-group-with-answers-browse.model';
import { FormParticipantStructuresDAO } from '@/@v2/forms/database/dao/form-participant-structures/form-participant-structures.dao';
import { collectParticipantsAnswersIds } from './collect-participants-answers-ids';

/**
 * Monta participantStructures para o browse de respostas.
 *
 * 1) Submissões com employee_id: estrutura via Employee + workspace (mesma regra do browse de participantes).
 * 2) Submissões sem employee (ex.: link compartilhado): tenta inferir hierarquia a partir de
 *    answer.value em perguntas SYSTEM (setor enriquecido); workspace permanece null.
 *
 * Respondentes sem estrutura resolvida são omitidos do array (client trata ausência como sem dado estrutural).
 */
export async function buildParticipantStructuresForBrowse(params: {
  groups: FormQuestionGroupWithAnswersBrowseModel[];
  companyId: string;
  formApplicationId: string;
  structuresDao: FormParticipantStructuresDAO;
}): Promise<FormParticipantStructureBrowseModel[]> {
  const { groups, companyId, formApplicationId, structuresDao } = params;
  const participantsAnswersIds = collectParticipantsAnswersIds(groups);
  if (participantsAnswersIds.length === 0) return [];

  const fromEmployee = await structuresDao.findByParticipantsAnswersIds({
    companyId,
    formApplicationId,
    participantsAnswersIds,
  });

  const byId = new Map<string, FormParticipantStructureBrowseModel>();
  for (const structure of fromEmployee) {
    byId.set(structure.participantsAnswersId, structure);
  }

  const missingOrEmpty = participantsAnswersIds.filter((id) => {
    const existing = byId.get(id);
    return !existing?.hierarchies.length;
  });

  if (missingOrEmpty.length > 0) {
    const hierarchyIdBySubmission = new Map<string, string>();

    for (const group of groups) {
      for (const question of group.questions) {
        if (question.details.type !== FormQuestionTypeEnum.SYSTEM) continue;
        for (const answer of question.answers) {
          const submissionId = answer.participantsAnswersId;
          if (!submissionId || !missingOrEmpty.includes(submissionId)) continue;
          const hierarchyId = answer.value?.trim();
          if (hierarchyId) {
            hierarchyIdBySubmission.set(submissionId, hierarchyId);
          }
        }
      }
    }

    const uniqueHierarchyIds = [
      ...new Set(hierarchyIdBySubmission.values()),
    ];
    const chainByHierarchyId = new Map<
      string,
      FormParticipantStructureBrowseModel['hierarchies']
    >();

    await Promise.all(
      uniqueHierarchyIds.map(async (hierarchyId) => {
        const chain = await structuresDao.findHierarchyChainByHierarchyId({
          hierarchyId,
        });
        if (chain.length > 0) {
          chainByHierarchyId.set(hierarchyId, chain);
        }
      }),
    );

    for (const submissionId of missingOrEmpty) {
      const hierarchyId = hierarchyIdBySubmission.get(submissionId);
      if (!hierarchyId) continue;
      const hierarchies = chainByHierarchyId.get(hierarchyId);
      if (!hierarchies?.length) continue;

      const existing = byId.get(submissionId);
      byId.set(
        submissionId,
        new FormParticipantStructureBrowseModel({
          participantsAnswersId: submissionId,
          workspaceId: existing?.workspaceId ?? null,
          workspaceName: existing?.workspaceName ?? null,
          hierarchies,
        }),
      );
    }
  }

  return participantsAnswersIds.map((id) => {
    const existing = byId.get(id);
    return (
      existing ??
      new FormParticipantStructureBrowseModel({
        participantsAnswersId: id,
        workspaceId: null,
        workspaceName: null,
        hierarchies: [],
      })
    );
  });
}
