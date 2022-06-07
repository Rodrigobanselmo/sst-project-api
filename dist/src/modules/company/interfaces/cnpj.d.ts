export interface ICnpjResponse {
    cnpj: string;
    name: string;
    size: string;
    fantasy: string;
    primary_activity?: CnaesEntity[] | null;
    secondary_activity?: CnaesEntity[] | null;
    phone: string;
    legal_nature: string;
    cadastral_situation: string;
    activity_start_date: string;
    cadastral_situation_date: string;
    legal_nature_code: string;
    type: string;
    cadastral_situation_description: string;
    address: {
        neighborhood: string;
        number: string;
        city: string;
        street: string;
        cep: string;
        complement: string;
        state: string;
    };
}
export interface CnaesEntity {
    code: string;
    name: string;
}
