import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { CharacterizationRoutes } from '@/@v2/security/characterization/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { AiAnalyzeCharacterizationUseCase } from '../use-cases/ai-analyze-characterization.usecase';
import { AiAnalyzeCharacterizationPath } from './ai-analyze-characterization.path';
import { AiAnalyzeCharacterizationPayload } from './ai-analyze-characterization.payload';

@Controller(CharacterizationRoutes.CHARACTERIZATION.AI_ANALYZE)
@UseGuards(JwtAuthGuard)
export class AiAnalyzeCharacterizationController {
  constructor(private readonly aiAnalyzeCharacterizationUseCase: AiAnalyzeCharacterizationUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async analyzeCharacterization(@Param() path: AiAnalyzeCharacterizationPath, @Body() body: AiAnalyzeCharacterizationPayload) {
    // return this.mockResponse;

    const response = await this.aiAnalyzeCharacterizationUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      characterizationId: path.characterizationId,
      customPrompt: body.customPrompt,
      model: body.model, // Pass the optional model parameter
    });

    return response;
  }

  private mockResponse = {
    analysis: JSON.stringify(
      {
        riscos: [
          {
            id_risco: 1,
            explicacao: 'Risco de ruído excessivo identificado devido ao funcionamento de equipamentos industriais',
            fonteGeradora: 'Máquinas e equipamentos em operação',
            probabilidade: 4,
            controlesExistentes: 'Uso de protetor auricular',
            medidasEngenhariaRecomendadas: ['Isolamento acústico das máquinas', 'Manutenção preventiva dos equipamentos'],
            medidasAdministrativasRecomendadas: ['Treinamento sobre uso de EPI', 'Rodízio de funcionários'],
            medidasEngenhariaExistentes: ['Enclausuramento parcial de equipamentos'],
            medidasAdministrativasExistentes: ['Fornecimento de EPI auditivo'],
            confianca: 0.85,
          },
          {
            id_risco: 2,
            explicacao: 'Risco ergonômico devido a posturas inadequadas durante as atividades',
            fonteGeradora: 'Postura inadequada na execução das tarefas',
            probabilidade: 3,
            controlesExistentes: 'Pausas regulares',
            medidasEngenhariaRecomendadas: ['Ajuste da altura das bancadas', 'Implementação de apoios ergonômicos'],
            medidasAdministrativasRecomendadas: ['Ginástica laboral', 'Treinamento em ergonomia'],
            medidasEngenhariaExistentes: [],
            medidasAdministrativasExistentes: ['Pausas de 15 minutos a cada 2 horas'],
            confianca: 0.75,
          },
        ],
        descricao:
          'Ambiente industrial com presença de máquinas e equipamentos em operação, onde trabalhadores executam atividades que envolvem exposição a ruído e posturas que podem gerar desconforto ergonômico.',
        processoTrabalho: [
          {
            desc: 'Processo de produção industrial',
            type: 'PARAGRAPH',
          },
          {
            desc: 'Operação de máquinas e equipamentos',
            type: 'BULLET_0',
          },
          {
            desc: 'Verificação de funcionamento dos equipamentos',
            type: 'BULLET_1',
          },
          {
            desc: 'Ajustes e calibrações necessárias',
            type: 'BULLET_1',
          },
          {
            desc: 'Manutenção preventiva',
            type: 'BULLET_0',
          },
          {
            desc: 'Limpeza e organização do ambiente',
            type: 'BULLET_1',
          },
        ],
      },
      null,
      2,
    ),
    confidence: 0.8,
    description:
      'Ambiente industrial com presença de máquinas e equipamentos em operação, onde trabalhadores executam atividades que envolvem exposição a ruído e posturas que podem gerar desconforto ergonômico.',
    workProcess: [
      {
        desc: 'Processo de produção industrial',
        type: 'PARAGRAPH',
      },
      {
        desc: 'Operação de máquinas e equipamentos',
        type: 'BULLET_0',
      },
      {
        desc: 'Verificação de funcionamento dos equipamentos',
        type: 'BULLET_1',
      },
      {
        desc: 'Ajustes e calibrações necessárias',
        type: 'BULLET_1',
      },
      {
        desc: 'Manutenção preventiva',
        type: 'BULLET_0',
      },
      {
        desc: 'Limpeza e organização do ambiente',
        type: 'BULLET_1',
      },
    ],
    recommendedRisks: ['risk-uuid-1', 'risk-uuid-2'], // Array of risk UUIDs recommended by AI
    detailedRisks: [
      {
        id: 'risk-uuid-1',
        name: 'Ruído',
        type: 'FISICO',
        explanation: 'Risco de ruído excessivo identificado devido ao funcionamento de equipamentos industriais',
        generateSource: 'Máquinas e equipamentos em operação',
        probability: 4,
        existingControls: 'Uso de protetor auricular',
        recommendedEngineeringMeasures: ['Isolamento acústico das máquinas', 'Manutenção preventiva dos equipamentos'],
        recommendedAdministrativeMeasures: ['Treinamento sobre uso de EPI', 'Rodízio de funcionários'],
        existingEngineeringMeasures: ['Enclausuramento parcial de equipamentos'],
        existingAdministrativeMeasures: ['Fornecimento de EPI auditivo'],
        confidence: 0.85,
      },
      {
        id: 'risk-uuid-1',
        name: 'Risco de ruído excessivo identificado devido ao funcionamento de equipamentos industriais',
        type: 'FISICO',
        explanation: 'Risco de ruído excessivo identificado devido ao funcionamento de equipamentos industriais',
        generateSource: 'Máquinas e equipamentos em operação',
        probability: 4,
        existingControls: 'Uso de protetor auricular',
        recommendedEngineeringMeasures: ['Isolamento acústico das máquinas', 'Manutenção preventiva dos equipamentos'],
        recommendedAdministrativeMeasures: ['Treinamento sobre uso de EPI', 'Rodízio de funcionários'],
        existingEngineeringMeasures: ['Enclausuramento parcial de equipamentos'],
        existingAdministrativeMeasures: ['Fornecimento de EPI auditivo'],
        confidence: 0.85,
      },
      {
        id: 'risk-uuid-2',
        name: 'Ergonômico',
        type: 'ERGONOMICO',
        explanation: 'Risco ergonômico devido a posturas inadequadas durante as atividades',
        generateSource: 'Postura inadequada na execução das tarefas',
        probability: 3,
        existingControls: 'Pausas regulares',
        recommendedEngineeringMeasures: ['Ajuste da altura das bancadas', 'Implementação de apoios ergonômicos'],
        recommendedAdministrativeMeasures: ['Ginástica laboral', 'Treinamento em ergonomia'],
        existingEngineeringMeasures: [],
        existingAdministrativeMeasures: ['Pausas de 15 minutos a cada 2 horas'],
        confidence: 0.75,
      },
    ],
    metadata: {
      companyId: 'mock-company-id',
      workspaceId: 'mock-workspace-id',
      characterizationId: 'mock-characterization-id',
      timestamp: new Date().toISOString(),
      totalAvailableRisks: 50,
      recommendedRisksCount: 2,
      model: 'gpt-4o-mock',
      contentItems: 3,
      responseFormat: 'json_schema',
    },
    characterization: {
      id: 'mock-characterization-id',
      name: 'Caracterização Mock para Testes',
      type: 'AMBIENTE',
    },
  };
}
