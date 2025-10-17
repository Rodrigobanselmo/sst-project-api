export namespace IAiAnalyzeCharacterizationUseCase {
  export type Params = {
    companyId: string;
    workspaceId: string;
    characterizationId: string;
    customPrompt?: string;
    model?: string; // Optional AI model to use (e.g., 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo')
  };

  export type AvailableRisk = {
    id: string;
    name: string;
    type: string;
  };

  export type CharacterizationPhoto = {
    id: string;
    photoUrl: string;
    name: string;
  };

  export type RiskFactorData = {
    riskFactor: {
      id: string;
      name: string;
      type: string;
    };
  };

  export type HomogeneousGroup = {
    riskFactorData: RiskFactorData[];
  };

  export type CharacterizationData = {
    id: string;
    name: string;
    type: string;
    description?: string;
    activities?: string[];
    considerations?: string[];
    paragraphs?: string[];
    temperature?: string;
    noiseValue?: string;
    luminosity?: string;
    moisturePercentage?: string;
    photos: CharacterizationPhoto[];
    homogeneousGroup: HomogeneousGroup;
  };

  export type AiRiskResponse = {
    id_risco: number;
    explicacao: string;
    fonteGeradora: string;
    probabilidade: number;
    controlesExistentes: string;
    medidasEngenharia: string[];
    medidasAdministrativas: string[];
    confianca: number;
  };

  export type AiJsonResponse = {
    riscos: AiRiskResponse[];
  };

  export type DetailedRisk = {
    id: string;
    name: string;
    type: string;
    explanation: string;
    generateSource: string;
    probability: number; // 1-5 scale
    existingControls: string;
    engineeringMeasures: string[];
    administrativeMeasures: string[];
    confidence: number;
  };

  export type Result = {
    analysis: string;
    confidence: number;
    recommendedRisks: string[]; // Array of risk UUIDs recommended by AI
    detailedRisks: DetailedRisk[]; // Detailed information about each recommended risk
    metadata?: Record<string, any>;
    characterization: {
      id: string;
      name: string;
      type: string;
    };
  };
}
