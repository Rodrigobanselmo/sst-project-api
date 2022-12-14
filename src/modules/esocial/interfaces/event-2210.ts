import { IEventProps } from './event-batch';

export enum doctorCouncilTypeEnum {
  CRM = 'CRM',
  CRO = 'CRO',
  RMS = 'RMS',
}

export enum IdeOCEnum2210 {
  CRM = 1,
  CRO = 2,
  RMS = 3,
}

export const mapResIdeOC: Record<doctorCouncilTypeEnum, IdeOCEnum2210> = {
  [doctorCouncilTypeEnum.CRM]: IdeOCEnum2210.CRM,
  [doctorCouncilTypeEnum.CRO]: IdeOCEnum2210.CRO,
  [doctorCouncilTypeEnum.RMS]: IdeOCEnum2210.RMS,
};

export const mapInverseResIdeOC: Record<IdeOCEnum2210, doctorCouncilTypeEnum> = {
  [IdeOCEnum2210.CRM]: doctorCouncilTypeEnum.CRM,
  [IdeOCEnum2210.CRO]: doctorCouncilTypeEnum.CRO,
  [IdeOCEnum2210.RMS]: doctorCouncilTypeEnum.RMS,
};

export const isWithDeath = (num?: number) => [3].includes(num || 0); // tpCat

export const isHrsWorked = (num?: number) => [1, 3].includes(num || 0); // tpAcid
export const isTypeReopen = (num?: number) => [2].includes(num || 0); // tpAcid
export const isAskCompany = (num?: number) => [1, 3].includes(num || 0); // tpCat

export const isOriginCat = (num?: number, nrRecCatOrig?: string) => nrRecCatOrig && [2, 3].includes(num || 0); // tpCat && nrRecCatOrig

export const isShowOriginCat = (num?: number) => [2, 3].includes(num || 0); // tpCat

export const isCepRequired = (num?: number) => [1, 3, 5].includes(num || 0); // tpLocal
export const isLocalEmpty = (num?: number) => [2].includes(num || 0); // tpLocal
export const isCityUfRequired = (num?: number) => [1, 3, 4, 5].includes(num || 0); // tpLocal
export const isCountryRequired = (num?: number) => [2].includes(num || 0); // tpLocal

export interface IEvent2210Props extends IEventProps {
  id: string;
  idFull?: string;
  cat: {
    dtAcid: Date;
    tpAcid: number;
    hrAcid?: string;
    hrsTrabAntesAcid?: string;
    tpCat: number;
    dtObito?: Date;
    indComunPolicia: boolean;
    codSitGeradora: string;
    iniciatCAT: number;
    obsCAT?: string;
    ultDiaTrab: Date;
    houveAfast: boolean;
    localAcidente: {
      tpLocal: number;
      dscLocal?: string;
      tpLograd?: string;
      dscLograd: string;
      nrLograd: string;
      complemento?: string;
      bairro?: string;
      cep?: string;
      codMunic?: string;
      uf?: string;
      pais?: string;
      codPostal?: string;
      ideLocalAcid?: {
        tpInsc: number;
        nrInsc: string;
      };
    };
    parteAtingida: {
      codParteAting: string;
      lateralidade: number;
    };
    agenteCausador: {
      codAgntCausador: string;
    };
    atestado: {
      dtAtendimento: Date;
      hrAtendimento: string;
      indInternacao: boolean;
      durTrat: number;
      indAfast: boolean;
      dscLesao: string;
      dscCompLesao?: string;
      diagProvavel?: string;
      codCID: string;
      observacao?: string;
      emitente: {
        nmEmit: string;
        ideOC: string;
        nrOC: string;
        ufOC?: string;
      };
    };
    catOrigem?: {
      nrRecCatOrig: string;
    };
  };
}

export const isTpAcidList = (v: number) => [1, 2, 3].includes(v);

export const isTpCatList = (v: number) => [1, 2, 3].includes(v);

export const isIniciatCATList = (v: number) => [1, 2, 3].includes(v);

export const isTpLocalList = (v: number) => [1, 2, 3, 4, 5, 6, 9].includes(v);

export const isTpInscList = (v: number) => [1, 3, 4].includes(v);

export const isLateralidadeList = (v: number) => [0, 1, 2, 3].includes(v);
