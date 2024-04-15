import { IColumnRuleMap } from '../../../types/IFileFactory.types';


export enum CompanyStructRSDataACGHHeaderEnum {
  TIPO = 'Tipo',
  UNIDADE = 'Unidade Marima',
  CNPJ = 'CNPJ/CPF/CEI/CAEPF',
  CODIGO_SETOR = 'Código Setor',
  SETOR = 'Setor',
  CODIGO_SETOR_D = 'Código Setor Desenvolvido',
  SETOR_D = 'Setor Desenvolvido',
  CODIGO_GHE = 'Código GHE',
  GHE = 'GHE',
  CODIGO_CARDO = 'Código Cargo',
  CARGO = 'Cargo',
  CODIGO_CARGO_D = 'Código Cargo Desenvolvido',
  CARGO_D = 'Cargo Desenvolvido',
  CODIGO_PT = 'Código Posição Trabalho',
  POSICAO = 'Posição Trabalho',
  INICIO = '*Inicio',
  FIM = 'Fim',
  TECNICA = '*Técnica ',
  EXPOSICAO = '*Exposição',
  AGENTE = 'AGENTE',
  TWA = 'TWA',
  STEL = 'STEL',
  CONSIDERAR_PCMSO = '*Considerar acima do nível de ação para PCMSO',
  NAO_CONSIDERAR_COMPLEMENTARES = '*Não considerar Exames Complementares',
  EPI = 'EPI eficaz',
  CA = 'Cas',
  EPI_EFICAZ = 'Uso Efetivo',
  TREINAMENTO = 'Treinamento',
  REGISTRO = 'Registro em Ficha',
  EPI_ALL = 'Foi observado o prazo de validade do produto? Segue instruções de uso, manuseio e armazenamento? (NT 110:2016 e NT 146:2015)',
  FONTE_GERADORA = 'Fonte Geradora',
  MEIO_PROP = 'Meio de Propagação',
  COMPROMETIMENTO = 'Comprometimento à Saúde',
  POSSIVEIS_DANOS = 'Possíveis Danos à Saúde',
  MEDIDAS_CONTROLE = 'Medidas de Controle',
  RECOMENDACOES = 'Recomendações',
  OBSERVACOES = 'Observações',
  ETAPA = 'Etapa',
  CODIGO = 'Código Integração Empresa',
}

export const CompanyStructRSDataACGHColumnMap: IColumnRuleMap<any> = {
  ...Object.values(CompanyStructRSDataACGHHeaderEnum).reduce((acc, key) => ({
    ...acc,
    [key]: {
      field: key,
      database: key,
    },
  }), {}),
};
