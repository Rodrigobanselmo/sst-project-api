import { Protocol, ProtocolToRisk } from '.prisma/client';
import { StatusEnum } from '@prisma/client';
import { RiskFactorsEntity } from './risk.entity';

export class ProtocolToRiskEntity implements ProtocolToRisk {
  id: number;
  riskId: string;
  protocolId: number;
  updated_at: Date;
  minRiskDegree: number;
  minRiskDegreeQuantity: number;
  companyId: string;
  protocol?: ProtocolEntity;
  risk?: RiskFactorsEntity;

  constructor(partial: Partial<ProtocolEntity>) {
    Object.assign(this, partial);
  }
}

export class ProtocolEntity implements Protocol {
  id: number;
  name: string;
  created_at: Date;
  deleted_at: Date;
  updated_at: Date;
  companyId: string;
  protocolToRisk: ProtocolToRiskEntity[];
  system: boolean;
  status: StatusEnum;

  constructor(partial: Partial<ProtocolEntity>) {
    Object.assign(this, partial);
  }
}
