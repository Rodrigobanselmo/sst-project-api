export type NavigationKind = 'route';

export interface NavigationDestination {
  key: string;
  kind: NavigationKind;
  /** Route path with `:companyId` style placeholders */
  target: string;
  label: string;
  description: string;
  /** Words/phrases that hint at this destination — helps LLM pick the right key */
  keywords: string[];
  /** Required params that must be resolved before navigation */
  requiredParams: string[];
  category: string;
}

export const NAVIGATION_CATALOG: NavigationDestination[] = [
  // ─── Pessoas ───
  {
    key: 'EMPLOYEES_LIST',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/empregados',
    label: 'Funcionários',
    description: 'Lista e gestão de funcionários (também é onde se cadastra um novo funcionário)',
    keywords: ['funcionários', 'empregados', 'colaboradores', 'pessoas', 'cadastrar funcionário', 'novo funcionário', 'adicionar funcionário'],
    requiredParams: ['companyId'],
    category: 'pessoas',
  },
  {
    key: 'HIERARCHY_LIST',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/hierarquia',
    label: 'Hierarquia (cargos, setores, gerências)',
    description: 'Estrutura organizacional: diretorias, gerências, setores, cargos',
    keywords: ['cargos', 'setores', 'diretorias', 'gerências', 'hierarquia', 'organograma', 'estrutura organizacional'],
    requiredParams: ['companyId'],
    category: 'pessoas',
  },

  // ─── Empresa ───
  {
    key: 'COMPANY_HOME',
    kind: 'route',
    target: '/dashboard/empresas/:companyId',
    label: 'Página da empresa',
    description: 'Dashboard inicial da empresa',
    keywords: ['empresa', 'dashboard da empresa', 'início', 'home da empresa'],
    requiredParams: ['companyId'],
    category: 'empresa',
  },
  {
    key: 'COMPANY_EDIT_PAGE',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/novo/empresa',
    label: 'Editar dados da empresa',
    description: 'Página de edição de dados cadastrais (CNPJ, razão social, etc.)',
    keywords: ['editar empresa', 'dados da empresa', 'cnpj', 'razão social', 'cadastro da empresa'],
    requiredParams: ['companyId'],
    category: 'empresa',
  },

  // ─── SST / Riscos ───
  {
    key: 'RISKS_LIST',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/fatores-riscos',
    label: 'Fatores de risco',
    description: 'Catálogo de fatores de risco (BIO, QUI, FIS, ERG, ACI)',
    keywords: ['riscos', 'fatores de risco', 'perigos', 'agentes de risco', 'cadastrar risco', 'novo risco'],
    requiredParams: ['companyId'],
    category: 'sst',
  },
  {
    key: 'CHARACTERIZATION_PAGE',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/novo/sst',
    label: 'Caracterização de riscos',
    description: 'Página para caracterizar riscos por grupos homogêneos / hierarquia',
    keywords: ['caracterizar risco', 'caracterização', 'editar risco', 'cadastrar risco em grupo', 'ferramenta de risco', 'sst'],
    requiredParams: ['companyId'],
    category: 'sst',
  },
  {
    key: 'GHOS_LIST',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/grupos-homogenios',
    label: 'Grupos homogêneos (GHO)',
    description: 'Grupos similares de exposição',
    keywords: ['gho', 'grupos homogêneos', 'grupos de exposição', 'gse'],
    requiredParams: ['companyId'],
    category: 'sst',
  },
  {
    key: 'EXAMS_LIST',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/exames',
    label: 'Exames ocupacionais',
    description: 'Gestão de exames médicos ocupacionais',
    keywords: ['exames', 'aso', 'pcmso', 'exames ocupacionais', 'exames médicos'],
    requiredParams: ['companyId'],
    category: 'sst',
  },
  {
    key: 'ACTION_PLAN',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/plano-de-acao',
    label: 'Plano de ação',
    description: 'Plano de ação SST com tarefas e responsáveis',
    keywords: ['plano de ação', 'tarefas sst', 'ações', 'pendências'],
    requiredParams: ['companyId'],
    category: 'sst',
  },
  {
    key: 'ABSENTEEISM',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/absenteismo/lista',
    label: 'Absenteísmo',
    description: 'Análise e cadastro de faltas/afastamentos',
    keywords: ['absenteísmo', 'faltas', 'afastamentos', 'atestados'],
    requiredParams: ['companyId'],
    category: 'sst',
  },
  {
    key: 'MANAGER_SYSTEM',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/gestao-sst',
    label: 'Gestão SST',
    description: 'Sistema integrado de gestão de SST',
    keywords: ['gestão sst', 'sistema sst', 'gerenciamento sst'],
    requiredParams: ['companyId'],
    category: 'sst',
  },

  // ─── Documentos ───
  // ATENÇÃO: existem DUAS rotas distintas de documento. NÃO confundir:
  //  - DOCUMENTS_GENERATE: GERAR um documento novo (PGR, LTCAT, PCMSO, Insalubridade, Periculosidade) a partir dos dados da empresa
  //  - DOCUMENTS_STORAGE: SALVAR/ARMAZENAR um documento já existente (upload de arquivo) e controlar vencimento
  // Se a intenção do usuário não estiver clara, PERGUNTE antes de propor um card.
  {
    key: 'DOCUMENTS_GENERATE',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/novo/documentos',
    label: 'Gerar novo documento (PGR, LTCAT, PCMSO, etc.)',
    description: 'Página onde o sistema GERA um documento novo (PGR, PCMSO, LTCAT, Insalubridade, Periculosidade) a partir dos dados de SST cadastrados na empresa. Use quando o usuário quer EMITIR/CRIAR/PRODUZIR um laudo/documento.',
    keywords: ['gerar documento', 'gerar pgr', 'gerar ltcat', 'gerar pcmso', 'gerar insalubridade', 'gerar periculosidade', 'criar laudo', 'emitir laudo', 'novo documento', 'novo pgr', 'produzir documento', 'fazer documento'],
    requiredParams: ['companyId'],
    category: 'documentos',
  },
  {
    key: 'DOCUMENTS_STORAGE',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/documentos',
    label: 'Documentos salvos (controle de vencimento)',
    description: 'Página de ARMAZENAMENTO de documentos já existentes (upload) com controle de data de vencimento. Use quando o usuário quer GUARDAR/SALVAR/SUBIR um arquivo de documento que ele já tem, ou consultar/gerenciar documentos salvos e seus vencimentos.',
    keywords: ['salvar documento', 'subir documento', 'upload documento', 'guardar documento', 'documentos salvos', 'controle de vencimento', 'vencimento de documento', 'arquivo de documento', 'gestão de documentos'],
    requiredParams: ['companyId'],
    category: 'documentos',
  },
  {
    key: 'ESOCIAL',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/esocial',
    label: 'eSocial',
    description: 'Transmissão de eventos eSocial',
    keywords: ['esocial', 'eventos esocial', '2210', '2220', '2240'],
    requiredParams: ['companyId'],
    category: 'documentos',
  },

  // ─── Agenda ───
  {
    key: 'SCHEDULE',
    kind: 'route',
    target: '/dashboard/empresas/:companyId/agenda',
    label: 'Agenda',
    description: 'Calendário de eventos e exames agendados',
    keywords: ['agenda', 'calendário', 'agendamentos', 'compromissos'],
    requiredParams: ['companyId'],
    category: 'agenda',
  },
];

export function findDestination(key: string): NavigationDestination | undefined {
  return NAVIGATION_CATALOG.find((d) => d.key === key);
}

/** Compact summary for system prompt injection — keeps token cost low */
export function summarizeForPrompt(): string {
  const byCategory = NAVIGATION_CATALOG.reduce<Record<string, NavigationDestination[]>>((acc, dest) => {
    (acc[dest.category] ??= []).push(dest);
    return acc;
  }, {});

  const lines: string[] = [];
  for (const [category, dests] of Object.entries(byCategory)) {
    lines.push(`[${category}]`);
    for (const d of dests) {
      lines.push(`  - ${d.key}: ${d.label} — ${d.description}`);
    }
  }
  return lines.join('\n');
}
