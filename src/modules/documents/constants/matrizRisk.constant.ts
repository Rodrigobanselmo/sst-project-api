import { palette } from '../../../shared/constants/palette';

export const matrixRiskMap = {
  [0]: {
    label: 'Não informado',
    short: 'NA',
    intervention: 'NÃO INFORMADO',
    color: palette.matrix[0].string,
    table: '',
    level: 1,
  },
  [1]: {
    label: 'Muito baixo',
    short: 'MB',
    intervention: 'AÇÃO SEM PRAZO',
    table: 'Muito Baixo\n(Aceitável)',
    color: palette.matrix[1].string,
    level: 1,
  },
  [2]: {
    label: 'Baixo',
    short: 'B',
    intervention: 'AÇÃO PARA LONGO PRAZO',
    table: 'Baixo\n(Aceitável)',
    level: 2,
    color: palette.matrix[2].string,
  },
  [3]: {
    label: 'Médio',
    short: 'M',
    intervention: 'AÇÃO PARA MÉDIO PRAZO',
    table: 'Moderado\n(Aceitável)',
    color: palette.matrix[3].string,
    level: 3,
  },
  [4]: {
    label: 'Alto',
    short: 'A',
    intervention: 'AÇÃO PARA CURTO PRAZO',
    table: 'Alto\n(Temp. Aceitável)',
    color: palette.matrix[4].string,
    level: 4,
  },
  [5]: {
    label: 'Muito\nAlto',
    short: 'MA',
    intervention: 'AÇÃO IMEDIATA',
    table: 'Muito Alto\n(Inaceitável)',
    color: palette.matrix[5].string,
    level: 5,
  },
  [6]: {
    label: 'Interromper\nAtividades',
    short: 'IA',
    intervention: 'INTERROMPER ATIVIDADES',
    table: 'Interromper\nAtividades',
    color: palette.matrix[5].string,
    level: 5,
  },
};

export const matrixRisk = [
  [2, 3, 4, 5, 5],
  [2, 3, 3, 4, 5],
  [2, 2, 3, 3, 4],
  [1, 2, 2, 3, 3],
  [1, 1, 2, 2, 2],
];
