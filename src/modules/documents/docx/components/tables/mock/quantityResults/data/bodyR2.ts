export const rowBodyNoise2: [string, string, string, string][] = [
  [
    'Qualquer resultado > 115 dB(A)',
    'NA',
    'Interromper as atividades imediatamente, situação de risco grave e eminente.',
    'Interromper as atividades',
  ],
  [
    'MVUE ≥ LEO\nMVUE ≥ 85,00 dB(A)',
    'IJ ≥ 1',
    'Devem ser adotadas medidas de controle que conduzam a valores de I < 1,0. Nesta situação, a frequência de monitoramento deve ser aquela necessária para a avaliação das medidas adotadas.',
    'Muito Alto\n(Inaceitável)',
  ],
  [
    '50% LEO ≤ MVUE < LEO\n80,00 dB(A) ≤ MVUE < 85,00 dB(A)',
    '0,5 ≤ IJ < 1',
    'Anual',
    'Alto\n(Temporariamente Aceitável)',
  ],
  [
    '25% LEO ≤ MVUE < 50% LEO\n75,0 dB(A) ≤ MVUE < 80,0 dB(A)',
    '0,25 ≤ IJ < 0,5',
    '2 em 2 anos',
    'Interromper as atividades',
  ],
  [
    '10% LEO ≤ MVUE < 25% LEO\n68,4,0 dB(A) ≤ MVUE < 75,0 dB(A)',
    '0,1 ≤ IJ 0,25',
    '2 em 2 anos',
    'Moderado\n(Aceitável)',
  ],
  [
    'MVUE < 10% LEO\nMVUE < 68,4 dB(A)',
    'IJ < 0,10',
    '2 em 2 anos',
    'Muito Baixo\n(Aceitável)',
  ],
];
