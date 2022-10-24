import { Protocol, ProtocolToRisk } from '.prisma/client';

export class ProtocolToRiskEntity implements ProtocolToRisk {
  id: number;
  riskId: string;
  protocolId: number;
  updated_at: Date;
  companyId: string;

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

  constructor(partial: Partial<ProtocolEntity>) {
    Object.assign(this, partial);
  }
}
