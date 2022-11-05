export enum EnumTpAmb {
  PROD = 1,
  PROD_REST = 2,
  VALIDATION = 7,
  TEST = 8,
  DEV = 9,
}

export interface IEventProps {
  // compareEvent?: any;
  ideEvento?: {
    indRetif?: 1 | 2 | number;
    tpAmb?: EnumTpAmb;
    procEmi?: 1 | 2 | 3 | 4 | 22 | number;
    nrRecibo?: string;
  };
  ideEmpregador: { tpInsc?: 1 | 2 | number; nrInsc: string };
  ideVinculo: {
    cpfTrab: string;
    matricula: string;
    // codCateg?: string;
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
