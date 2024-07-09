export const rowBodyQui: [string, string, string, string][] = [
  [
    'Qualquer resultado > IPVS',
    'NA',
    'Interromper as atividades imediatamente, situação de risco grave e iminente.',
    'Interromper as atividades',
  ],
  [
    'MVUE ≥ LEO',
    'IJ ≥ 1',
    'Devem ser adotadas medidas de controle que conduzam a valores de I < 1,0. Nesta situação, a frequência de monitoramento deve ser aquela necessária para a avaliação das medidas adotadas.',
    'Muito Alto\n(Inaceitável)',
  ],
  ['50% LEO ≤ MVUE < LEO', '0,5 ≤ IJ < 1', 'Anual', 'Alto\n(Temporariamente Aceitável)'],
  ['25% LEO ≤ MVUE < 50% LEO', '0,25 ≤ IJ < 0,5', '2 em 2 anos', 'Moderado\n(Aceitável)'],
  ['10% LEO ≤ MVUE < 25% LEO', '0,1 ≤ IJ 0,25', '2 em 2 anos', 'Muito Baixo\n(Aceitável)'],
  ['MVUE < 10% LEO', 'IJ < 0,10', '2 em 2 anos', 'Muito Baixo\n(Aceitável)'],
];
