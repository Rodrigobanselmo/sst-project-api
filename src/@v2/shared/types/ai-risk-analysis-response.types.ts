export type AiRiskAnalysisResponse = {
  frps: string; // Nome do FRPS
  fontesGeradoras: Array<{
    nome: string;
    justificativa: string;
    origem: 'sistema' | 'ia'; // 'sistema' for existing, 'ia' for AI suggestions
  }>;
  medidasEngenhariaRecomendadas: Array<{
    nome: string;
    justificativa: string;
    origem: 'sistema' | 'ia'; // modificações recomendadas no local/equipamento para isolar/remover perigo
  }>;
  medidasAdministrativasRecomendadas: Array<{
    nome: string;
    justificativa: string;
    origem: 'sistema' | 'ia'; // organização recomendada do trabalho para reduzir exposição
  }>;
};
