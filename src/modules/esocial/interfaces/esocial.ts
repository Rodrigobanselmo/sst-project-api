export interface IEsocialSendBatchResponse {
  ideEmpregador?: { tpInsc: number; nrInsc: string };
  ideTransmissor?: { tpInsc: number; nrInsc: string };
  status?: { cdResposta: string; descResposta: string };
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

export enum IdeOCEnum {
  CRM = 1,
  CRO = 2,
  RMS = 3,
  CREA = 4,
  OTHER = 9,
}

export declare namespace IEsocialFetchBatch {
  export interface Event {
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
          recibo?: {
            nrRecibo?: string;
            hash?: string;
          };
        };
      };
    };
  }
  export interface Status {
    cdResposta: string;
    descResposta: string;
  }

  export interface Response {
    ideEmpregador?: { tpInsc: number; nrInsc: string };
    ideTransmissor?: { tpInsc: number; nrInsc: string };
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

export const checkTime = (time: string, limitHours: number) => {
  if (!time) return { valid: false, message: 'informar valor de hora' };
  const [h, m] = time.split(':');

  if (!h || !m) return { valid: false, message: 'Formato de hora inválido' };

  if (Number(h) >= limitHours) return { valid: false, message: `Hora não pode ser maior que ${limitHours} horas` };
  if (Number(m) >= 59) return { valid: false, message: `Formato de hora inválido` };

  return { valid: true, message: '' };
};
