export type Nr07CatalogRiskDefinition = {
  key: string;
  name: string;
  cas: string | null;
  synonymous: string[];
  notes: string;
};

export const NR07_CATALOG_RISK_DEFINITIONS: Nr07CatalogRiskDefinition[] = [
  {
    key: 'methemoglobin-inducers',
    name: 'Indutores de metahemoglobina',
    cas: null,
    synonymous: [
      'Indutores de Metahemoglobina',
      'Agentes indutores de metahemoglobina',
      'Metahemoglobinizantes',
    ],
    notes:
      'Grupo normativo NR-07 Anexo I; não é substância única. Criado para curadoria de indicadores biológicos.',
  },
  {
    key: 'cholinesterase-inhibitor-insecticides',
    name: 'Inseticidas inibidores da Colinesterase',
    cas: null,
    synonymous: [
      'Inseticidas inibidores da colinesterase',
      'Inibidores da Colinesterase',
      'Organofosforados e carbamatos',
      'Inseticidas organofosforados',
      'Inseticidas carbamatos',
    ],
    notes:
      'Grupo normativo NR-07 Anexo I; abrange inseticidas inibidores de colinesterase.',
  },
  {
    key: 'n-methyl-2-pyrrolidone',
    name: 'N-metil-2-pirrolidona',
    cas: '872-50-4',
    synonymous: [
      'NMP',
      'N-Methyl-2-pyrrolidone',
      '1-metil-2-pirrolidona',
      'N-metilpirrolidona',
    ],
    notes: 'Fator de risco químico de catálogo para NR-07 Anexo I.',
  },
];
