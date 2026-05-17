import { FormQuestionGroupWithAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-question-group-with-answers-browse.model';

/** IDs únicos de submissão presentes no browse (mesma chave de answer.participantsAnswersId). */
export function collectParticipantsAnswersIds(
  groups: FormQuestionGroupWithAnswersBrowseModel[],
): string[] {
  const ids = new Set<string>();
  for (const group of groups) {
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
