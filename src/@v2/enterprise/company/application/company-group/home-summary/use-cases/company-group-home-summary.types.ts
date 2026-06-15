import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

export namespace ICompanyGroupHomeSummaryUseCase {
  export type Params = {
    companyGroupId: number;
    user: UserPayloadDto;
  };

  export type Result = {
    companyGroupId: number;
    companyGroupName: string;
    scope: 'group';
    includedCompanyIds: string[];
    employees: {
      active: number;
      inactive: number;
      away: number;
    };
    companyData: {
      hierarchies: number;
      workspaces: number;
      clinicsConnected: number;
    };
    characterization: {
      risks: number;
      exams: number;
      protocols: number;
      environments: number;
      epis: number;
      homogeneousGroups: number;
    };
    documents: {
      status: 'not_available_in_group_scope';
      pgrLatestAt: null;
      pcmsoLatestAt: null;
    };
    actionPlan:
      | {
          status: 'available';
          total: number;
          pending: number;
          started: number;
          done: number;
          canceled: number;
          companies: {
            companyId: string;
            companyName: string | null;
            companyFantasy: string | null;
            companyInitials: string | null;
            total: number;
            pending: number;
            started: number;
            done: number;
            canceled: number;
          }[];
        }
      | {
          status: 'not_available_in_group_scope';
        };
    absenteeism: {
      status: 'partial';
      awayActive: number;
      records: null;
      lostDays: null;
    };
    forms: {
      status: 'available';
    };
  };
}
