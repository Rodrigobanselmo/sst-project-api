import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

export type IDocumentBaseDataVO = {
  isQ5?: boolean;
  isHideOriginColumn?: boolean;
  isHideCA?: boolean;
  hasEmergencyPlan?: boolean;
  source?: string;
  visitDate?: Date;
  complementaryDocs?: string[];
  complementarySystems?: string[];
  monthsPeriodLevel_2?: number;
  monthsPeriodLevel_3?: number;
  monthsPeriodLevel_4?: number;
  monthsPeriodLevel_5?: number;
};

export class DocumentBaseDataVO {
  isQ5: boolean;
  isHideCA: boolean;
  isHideOriginColumn: boolean;
  hasEmergencyPlan: boolean;
  source?: string;
  visitDate?: Date;
  aprTypeSeparation?: HierarchyTypeEnum;
  complementaryDocs: string[];
  complementarySystems: string[];
  monthsPeriodLevel_2: number;
  monthsPeriodLevel_3: number;
  monthsPeriodLevel_4: number;
  monthsPeriodLevel_5: number;

  constructor(params: IDocumentBaseDataVO) {
    this.isQ5 = params.isQ5 || false;
    this.isHideCA = params.isHideCA || false;
    this.isHideOriginColumn = params.isHideOriginColumn || false;
    this.hasEmergencyPlan = params.hasEmergencyPlan || false;
    this.source = params.source;
    this.visitDate = params.visitDate;
    this.complementaryDocs = params.complementaryDocs || [];
    this.complementarySystems = params.complementarySystems || [];
    this.monthsPeriodLevel_2 = params.monthsPeriodLevel_2 || 24;
    this.monthsPeriodLevel_3 = params.monthsPeriodLevel_3 || 12;
    this.monthsPeriodLevel_4 = params.monthsPeriodLevel_4 || 6;
    this.monthsPeriodLevel_5 = params.monthsPeriodLevel_5 || 3;
  }

  getMonthsPeriodLevel(level: number): number | null {
    switch (level) {
      case 2:
        return this.monthsPeriodLevel_2;
      case 3:
        return this.monthsPeriodLevel_3;
      case 4:
        return this.monthsPeriodLevel_4;
      case 5:
        return this.monthsPeriodLevel_5;
      default:
        return null;
    }
  }
}
