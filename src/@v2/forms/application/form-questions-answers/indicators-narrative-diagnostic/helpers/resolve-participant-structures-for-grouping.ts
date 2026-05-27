import { FormQuestionsAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-questions-answers-browse.model';
import { FormParticipantStructureBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-participant-structure-browse.model';

export function collectParticipantsAnswersIdsFromBrowse(
  formQuestionsAnswers: FormQuestionsAnswersBrowseModel,
): string[] {
  const ids = new Set<string>();
  for (const group of formQuestionsAnswers.results) {
    for (const question of group.questions) {
      for (const answer of question.answers) {
        if (answer.participantsAnswersId) {
          ids.add(answer.participantsAnswersId);
        }
      }
    }
  }
  return Array.from(ids);
}

export function resolveParticipantStructuresForGrouping(
  formQuestionsAnswers: FormQuestionsAnswersBrowseModel,
): FormParticipantStructureBrowseModel[] {
  const participantIds = collectParticipantsAnswersIdsFromBrowse(formQuestionsAnswers);
  if (participantIds.length === 0) return [];

  const bySubmissionId = new Map<string, FormParticipantStructureBrowseModel>();
  for (const structure of formQuestionsAnswers.participantStructures) {
    bySubmissionId.set(structure.participantsAnswersId, structure);
  }

  return participantIds.map(
    (participantsAnswersId) =>
      bySubmissionId.get(participantsAnswersId) ??
      new FormParticipantStructureBrowseModel({
        participantsAnswersId,
        companyId: null,
        companyName: null,
        workspaceId: null,
        workspaceName: null,
        hierarchies: [],
      }),
  );
}
