import { HierarchyEnum, RiskFactorsEnum } from '@prisma/client';

export namespace IFormQuestionsAnswersRisksService {
  export type Params = {
    companyId: string;
    formApplicationId: string;
  };

  export type RiskData = {
    id: string;
    name: string;
    severity: number;
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

  export type HierarchyGroupData = {
    id: string;
    name: string;
    hierarchyIds: string[];
  };

  export type GroupedEntityData = {
    id: string;
    name: string;
    type: string;
  };

  export type Result = {
    hierarchyRiskMap: Record<string, Record<string, HierarchyRiskSummary>>;
    hierarchyMap: Record<string, HierarchyData>;
    riskMap: Record<string, RiskData>;
    participantAnswers: ParticipantAnswerData[];

    // Individual sector data (used in risk analysis to list each sector separately)
    entityRiskMap: Record<string, Record<string, { values: number[]; probability: number }>>;
    entityMap: Record<string, HierarchyData>;

    // Grouped data (merged sectors shown as single entities in indicators/PDF)
    groupedEntityRiskMap: Record<string, Record<string, { values: number[]; probability: number }>>;
    groupedEntityMap: Record<string, GroupedEntityData>;
    hierarchyGroups: HierarchyGroupData[];
  };
}
