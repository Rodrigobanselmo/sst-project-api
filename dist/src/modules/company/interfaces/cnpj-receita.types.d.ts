export interface ICnpjReceitaResponse {
    abertura: string;
    situacao: string;
    tipo: string;
    nome: string;
    fantasia: string;
    porte: string;
    natureza_juridica: string;
    atividade_principal?: AtividadePrincipalEntityOrAtividadesSecundariasEntity[] | null;
    atividades_secundarias?: AtividadePrincipalEntityOrAtividadesSecundariasEntity[] | null;
    qsa?: QsaEntity[] | null;
    logradouro: string;
    numero: string;
    complemento: string;
    municipio: string;
    bairro: string;
    uf: string;
    cep: string;
    email: string;
    telefone: string;
    data_situacao: string;
    cnpj: string;
    ultima_atualizacao: string;
    status: string;
    efr: string;
    motivo_situacao: string;
    situacao_especial: string;
    data_situacao_especial: string;
    capital_social: string;
    billing: Billing;
}
export interface AtividadePrincipalEntityOrAtividadesSecundariasEntity {
    code: string;
    text: string;
}
export interface QsaEntity {
    nome: string;
    qual: string;
}
export interface Billing {
    free: boolean;
    database: boolean;
}
