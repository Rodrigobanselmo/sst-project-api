export declare enum TpAmbEnum {
    PROD = 1,
    PROD_REST = 2,
    VALIDATION = 7,
    TEST = 8,
    DEV = 9
}
export declare enum EventGroupEnum {
    TABLES = 1,
    NO_PERIODIC = 2,
    PERIODIC = 3
}
export declare enum TpIncsEnum {
    CNPJ = 1,
    CPF = 2
}
export declare enum IndRetifEnum {
    ORIGINAL = 1,
    MODIFIED = 2
}
export declare enum ProcEmiEnum {
    SOFTWARE = 1,
    GOV_WEB = 3,
    GOV_JURIDIC = 4
}
export interface IEventProps {
    eventGroup?: EventGroupEnum;
    ideEvento?: {
        indRetif?: IndRetifEnum;
        tpAmb?: TpAmbEnum;
        procEmi?: ProcEmiEnum;
        nrRecibo?: string;
    };
    ideEmpregador: {
        tpInsc?: TpIncsEnum;
        nrInsc: string;
    };
    ideVinculo?: {
        cpfTrab: string;
        matricula: string;
    };
}
export interface IBatchProps {
    eventGroup: EventGroupEnum;
    ideEmpregador: {
        tpInsc?: TpIncsEnum;
        nrInsc: string;
    };
}
export interface IEventBatch {
    evento: {
        _attributes: {
            Id: string;
        };
        eSocial: {
            _attributes: {
                xmlns: string;
            };
        };
    };
}
