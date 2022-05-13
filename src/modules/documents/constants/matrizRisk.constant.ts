export const matrixRiskMap = {
  [1]: {
    label: 'Muito baixo',
    short: 'MB',
    intervention: 'AÇÃO SEM PRAZO',
    level: 1,
  },
  [2]: {
    label: 'Baixo',
    short: 'B',
    intervention: 'AÇÃO PARA LONGO PRAZO',
    level: 2,
  },
  [3]: {
    label: 'Médio',
    short: 'M',
    intervention: 'AÇÃO PARA MÉDIO PRAZO',
    level: 3,
  },
  [4]: {
    label: 'Alto',
    short: 'A',
    intervention: 'AÇÃO PARA CURTO PRAZO',
    level: 4,
  },
  [5]: {
    label: 'Muito Alto',
    short: 'MA',
    intervention: 'AÇÃO IMEDIATA',
    level: 5,
  },
};

export const matrixRisk = [
  [3, 4, 4, 5, 5],
  [3, 3, 4, 4, 5],
  [2, 2, 3, 4, 4],
  [1, 2, 2, 3, 4],
  [1, 1, 2, 3, 3],
];
