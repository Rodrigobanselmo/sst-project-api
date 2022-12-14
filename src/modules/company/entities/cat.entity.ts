import { EmployeeESocialEventEntity } from './../../esocial/entities/employeeEsocialEvent.entity';
import {
  Cat,
  Cities,
  EsocialTable13BodyPart,
  EsocialTable14And15Acid,
  EsocialTable17Injury,
  EsocialTable20Lograd,
  EsocialTable6Country,
  Professional,
  StatusEnum,
  Uf,
} from '@prisma/client';
import { ProfessionalEntity } from '../../users/entities/professional.entity';
import { CidEntity } from './cid.entity';
import { EmployeeEntity } from './employee.entity';

export class CatEntity implements Cat {
  id: number;
  dtAcid: Date;
  tpAcid: number;
  hrAcid: string;
  hrsTrabAntesAcid: string;
  tpCat: number;
  isIndCatObito: boolean;
  dtObito: Date;
  isIndComunPolicia: boolean;
  iniciatCAT: number;
  obsCAT: string;
  ultDiaTrab: Date;
  houveAfast: boolean;
  tpLocal: number;
  dscLocal: string;
  dscLograd: string;
  nrLograd: string;
  complemento: string;
  bairro: string;
  cep: string;
  codPostal: string;
  ideLocalAcidTpInsc: number;
  ideLocalAcidCnpj: string;
  lateralidade: number;
  dtAtendimento: Date;
  hrAtendimento: string;
  isIndInternacao: boolean;
  durTrat: number;
  isIndAfast: boolean;
  dscCompLesao: string;
  diagProvavel: string;
  observacao: string;
  nrRecCatOrig: string;

  codSitGeradora: string;
  esocialSitGeradora?: EsocialTable14And15Acid;

  docId: number;
  doc?: Partial<ProfessionalEntity>;

  codCID: string;
  cid?: CidEntity;

  tpLograd: string;
  esocialLograd?: EsocialTable20Lograd;

  pais: string;
  countryCodeEsocial6?: EsocialTable6Country;

  uf: string;
  uf_table: Uf;

  codMunic: string;
  city?: Cities;

  codAgntCausador: string;
  esocialAgntCausador?: EsocialTable14And15Acid;

  dscLesao: string;
  esocialLesao?: EsocialTable17Injury;

  employeeId: number;
  employee?: EmployeeEntity;

  codParteAting: string;
  codParteAtingEsocial13?: EsocialTable13BodyPart;
  status: StatusEnum;

  catOriginId: number;
  catOrigin: CatEntity;
  catReopen: CatEntity[];

  sendEvent: boolean;
  events: EmployeeESocialEventEntity[];

  constructor(partial: Partial<CatEntity>) {
    Object.assign(this, partial);

    if (this.doc) {
      this.doc = new ProfessionalEntity(this.doc);
    }
    if (this.employee) {
      this.employee = new EmployeeEntity(this.employee as any);
    }
  }
}
