import { IColumnRuleMap } from '../../../types/IFileFactory.types';


export enum CompanyStructRSDataACGHHeaderEnum {
  TIPO = 'Tipo ****TIPO',
  UNIDADE = 'Unidade Marima ****UNIDADE',
  CNPJ = 'CNPJ/CPF/CEI/CAEPF ****CNPJ',
  CODIGO_SETOR = 'Código Setor ****CODIGO_SETOR',
  SETOR = 'Setor ****SETOR',
  CODIGO_SETOR_D = 'Código Setor Desenvolvido ****CODIGO_SETOR_D',
  SETOR_D = 'Setor Desenvolvido ****SETOR_D',
  CODIGO_GHE = 'Código GHE ****CODIGO_GHE',
  GHE = 'GHE ****GHE',
  CODIGO_CARDO = 'Código Cargo ****CODIGO_CARDO',
  CARGO = 'Cargo ****CARGO',
  CODIGO_CARGO_D = 'Código Cargo Desenvolvido ****CODIGO_CARGO_D',
  CARGO_D = 'Cargo Desenvolvido ****CARGO_D',
  CODIGO_PT = 'Código Posição Trabalho ****CODIGO_PT',
  POSICAO = 'Posição Trabalho ****POSICAO',
  INICIO = '*Inicio ****INICIO',
  FIM = 'Fim ****FIM',
  TECNICA = '*Técnica  ****TECNICA',
  EXPOSICAO = '*Exposição ****EXPOSICAO',
  AGENTE = 'AGENTE ****AGENTE',
  TWA = 'TWA ****TWA',
  STEL = 'STEL ****STEL',
  CONSIDERAR_PCMSO = '*Considerar acima do nível de ação para PCMSO ****CONSIDERAR_PCMSO',
  NAO_CONSIDERAR_COMPLEMENTARES = '*Não considerar Exames Complementares ****NAO_CONSIDERAR_COMPLEMENTARES',
  EPI = 'EPI eficaz ****EPI',
  CA = 'Cas ****CA',
  EPI_EFETIVO = 'Uso Efetivo ****EPI_EFETIVO',
  TREINAMENTO = 'Treinamento ****TREINAMENTO',
  REGISTRO = 'Registro em Ficha ****REGISTRO',
  EPI_ALL = 'Foi observado o prazo de validade do produto? Segue instruções de uso, manuseio e armazenamento? (NT 110:2016 e NT 146:2015) ****EPI_ALL',
  FONTE_GERADORA = 'Fonte Geradora ****FONTE_GERADORA',
  MEIO_PROP = 'Meio de Propagação ****MEIO_PROP',
  COMPROMETIMENTO = 'Comprometimento à Saúde ****COMPROMETIMENTO',
  POSSIVEIS_DANOS = 'Possíveis Danos à Saúde ****POSSIVEIS_DANOS',
  MEDIDAS_CONTROLE = 'Medidas de Controle ****MEDIDAS_CONTROLE',
  RECOMENDACOES = 'Recomendações ****RECOMENDACOES',
  OBSERVACOES = 'Observações ****OBSERVACOES',
  ETAPA = 'Etapa ****ETAPA',
  CODIGO = 'Código Integração Empresa ****CODIGO',
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
