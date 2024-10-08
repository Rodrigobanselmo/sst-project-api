export const rowBodyFullBodyVibration: [string, string, string, string, string, string][] = [
  ['< 0,1', '< 2,1', 'Aceitável', 'No mínimo manutenção da condição existente.', 'Muito Baixo', 'Aceitável'],
  ['0,1 a 0,5', '2,1 a 9,1', 'Aceitável', 'No mínimo manutenção da condição existente.', 'Baixo', 'Aceitável'],
  [
    '> 0,5 a < 0,9',
    '> 9,1 a < 16,4',
    'Acima do nível de ação',
    'No mínimo adoção de medidas preventivas.',
    'Moderado',
    'Temporariamente Aceitável',
  ],
  [
    '0,9 a 1,1',
    '16,4 a 21',
    'Região de incerteza',
    'Adoção de medidas preventivas e corretivas visando à redução da exposição diária.',
    'Alto',
    'Temporariamente Aceitável',
  ],
  [
    'Acima de 1,1',
    'Acima de 21',
    'Acima do limite de exposição',
    'Adoção imediata de medidas corretivas.',
    'Muito Alto',
    'Inaceitável',
  ],
];
