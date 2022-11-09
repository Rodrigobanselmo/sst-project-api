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
