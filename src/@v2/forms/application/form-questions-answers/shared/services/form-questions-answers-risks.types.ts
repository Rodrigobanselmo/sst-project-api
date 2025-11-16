import { HierarchyEnum, RiskFactorsEnum } from '@prisma/client';

export namespace IFormQuestionsAnswersRisksService {
  export type Params = {
    companyId: string;
    formApplicationId: string;
  };

  export type RiskData = {
    id: string;
    name: string;
    type: RiskFactorsEnum;
    subTypes: { sub_type: { id: number; name: string } }[];
  };

  export type HierarchyData = {
    id: string;
    name: string;
    type: HierarchyEnum;
  };

  export type OptionData = {
    id: string;
    data: {
      value: string;
      text: string;
    }[];
  };

  export type QuestionData = {
    id: string;
    text: string;
    risks: RiskData[];
    options: OptionData[];
  };

  export type QuestionAnswerData = {
    question: QuestionData;
    selectedOptions: OptionData[];
    numericValues: number[];
    averageValue: number;
    textValues: string[];
  };

  export type ParticipantAnswerData = {
    participantId: string;
    hierarchy: HierarchyData;
    questionAnswers: QuestionAnswerData[];
  };

  export type QuestionSummary = {
    questionId: string;
    questionText: string;
    values: number[];
    averageValue?: number;
  };

  export type HierarchyRiskSummary = {
    riskId: string;
    values: number[];
    probability: number;
    questions: QuestionSummary[];
  };

  export type Result = {
    // New detailed data structure
    hierarchyRiskMap: Record<string, Record<string, HierarchyRiskSummary>>;
    hierarchyMap: Record<string, HierarchyData>;
    riskMap: Record<string, RiskData>;
    participantAnswers: ParticipantAnswerData[];

    // Legacy format for backward compatibility with existing BrowseFormQuestionsAnswersRisksUseCase
    entityRiskMap: Record<string, Record<string, { values: number[]; probability: number }>>;
    entityMap: Record<string, HierarchyData>;
  };
}
