export interface IEsocialSendBatchResponse {
    ideEmpregador?: {
        tpInsc: number;
        nrInsc: string;
    };
    ideTransmissor?: {
        tpInsc: number;
        nrInsc: string;
    };
    status?: {
        cdResposta: string;
        descResposta: string;
    };
    dadosRecepcaoLote?: {
        dhRecepcao?: string;
        versaoAplicativoRecepcao?: string;
        protocoloEnvio?: string;
    };
    ocorrencia?: {
        codigo?: string;
        descricao?: string;
        tipo?: string;
        localizacao?: string;
    }[];
}
export declare enum IdeOCEnum {
    CRM = 1,
    CREA = 4,
    OTHER = 9
}
export declare namespace IEsocialFetchBatch {
    interface Event {
        attributes: {
            Id: string;
        };
        retornoEvento: {
            eSocial: {
                retornoEvento: {
                    attributes: {
                        Id: string;
                    };
                    ideEmpregador: {
                        tpInsc: string;
                        nrInsc: string;
                    };
                    recepcao: {
                        tpAmb: string;
                        dhRecepcao: Date;
                        versaoAppRecepcao: string;
                        protocoloEnvioLote: string;
                    };
                    processamento: {
                        cdResposta: string;
                        descResposta: string;
                        versaoAppProcessamento: string;
                        dhProcessamento: Date;
                    };
                };
            };
        };
    }
    interface Status {
        cdResposta: string;
        descResposta: string;
    }
    interface Response {
        ideEmpregador?: {
            tpInsc: number;
            nrInsc: string;
        };
        ideTransmissor?: {
            tpInsc: number;
            nrInsc: string;
        };
        status: Status;
        dadosRecepcaoLote?: {
            dhRecepcao: Date;
            versaoAplicativoRecepcao: string;
            protocoloEnvio: string;
        };
        dadosProcessamentoLote?: {
            versaoAplicativoProcessamentoLote: string;
        };
        retornoEventos?: {
            evento: Event | Event[];
        };
    }
}
