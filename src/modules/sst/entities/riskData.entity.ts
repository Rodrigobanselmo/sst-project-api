import { ProtocolToRiskEntity } from './protocol.entity';
import { ApiProperty } from '@nestjs/swagger';

import { HierarchyEntity } from '../../company/entities/hierarchy.entity';
import { HomoGroupEntity } from '../../company/entities/homoGroup.entity';
import { originRiskMap } from '../../../shared/constants/maps/origin-risk';
import { getMatrizRisk } from '../../../shared/utils/matriz';
import {
  IRiskDataJson,
  IRiskDataJsonHeat,
  IRiskDataJsonNoise,
  IRiskDataJsonQui,
  IRiskDataJsonRadiation,
  IRiskDataJsonVibration,
  QuantityTypeEnum,
} from '../../company/interfaces/risk-data-json.types';
import { heatTableLEOConstant, heatTableLIIConstant, heatTableNAConstant, heatTableTETOConstant } from '../../documents/constants/heatTable.constant';
import { EpiEntity } from './epi.entity';
import { GenerateSourceEntity } from './generateSource.entity';
import { RecMedEntity } from './recMed.entity';
import { RiskFactorsEntity } from './risk.entity';
import { Prisma, RiskFactorData } from '.prisma/client';
import { RiskDataRecEntity } from './riskDataRec.entity';
import { EpiRiskDataEntity } from './epiRiskData.entity';
import { EngsRiskDataEntity } from './engsRiskData.entity';
import { ExamRiskDataEntity } from './examRiskData.entity';
import { ExamEntity } from './exam.entity';
import { isRiskQuantity } from 'src/shared/utils/isRiskQuantity';

export class RiskFactorDataEntity implements RiskFactorData {
  @ApiProperty({ description: 'The id of the Company' })
  id: string;

  @ApiProperty({ description: 'The probability of the risk data' })
  probability: number;

  @ApiProperty({ description: 'The probability of the risk data' })
  probabilityAfter: number;

  @ApiProperty({ description: 'The company id related to the risk data' })
  companyId: string;

  @ApiProperty({ description: 'The creation date of the risk data' })
  created_at: Date;

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  @ApiProperty({ description: 'The hierarchy data' })
  hierarchy?: HierarchyEntity;

  @ApiProperty({ description: 'The hierarchy id' })
  hierarchyId: string;

  @ApiProperty({ description: 'The homogeneous group data' })
  homogeneousGroup?: HomoGroupEntity;

  @ApiProperty({ description: 'The homogeneous group id' })
  homogeneousGroupId: string;

  @ApiProperty({ description: 'The risk factor data' })
  riskFactor?: RiskFactorsEntity;

  @ApiProperty({ description: 'The risk id' })
  riskId: string;

  @ApiProperty({ description: 'The risk group data id' })
  riskFactorGroupDataId: string;

  @ApiProperty({
    description: 'The array with recommendations data',
  })
  recs?: RecMedEntity[];

  @ApiProperty({
    description: 'The array with measure controls data',
  })
  engs?: RecMedEntity[];

  @ApiProperty({
    description: 'The array with measure controls data',
  })
  adms?: RecMedEntity[];

  @ApiProperty({ description: 'The array with generate source data' })
  generateSources?: GenerateSourceEntity[];

  @ApiProperty({ description: 'The array with generate source data' })
  epis?: EpiEntity[];

  @ApiProperty({ description: 'The array with exam data' })
  exams?: ExamEntity[];

  exposure: number | null;
  dataRecs?: RiskDataRecEntity[];
  level: number;
  json: Prisma.JsonValue;
  isQuantity?: boolean;
  ibtugLEO?: number;
  ibtug?: number;
  probAren?: number;
  probVdvr?: number;
  origin?: string;
  ro?: string;
  intensity?: number;
  vdvrValue?: number;
  arenValue?: number;
  prioritization?: number;
  intervention?: string;
  progress?: number;
  epiToRiskFactorData?: EpiRiskDataEntity[];
  engsToRiskFactorData?: EngsRiskDataEntity[];
  examsToRiskFactorData?: ExamRiskDataEntity[];
  standardExams: boolean;
  endDate: Date;
  startDate: Date;
  deletedAt: Date;
  protocolsToRisk: ProtocolToRiskEntity[];

  constructor(partial: Partial<RiskFactorDataEntity>) {
    Object.assign(this, partial);

    if (partial?.homogeneousGroup) {
      this.homogeneousGroup = new HomoGroupEntity(partial.homogeneousGroup);
    }

    this.getOrigin();

    if (partial.riskFactor) {
      this.riskFactor = new RiskFactorsEntity(partial.riskFactor);

      this.getMatrix();
    }

    this.progress = 0;
    this.isQuantity = false;

    if (this.json && typeof this.json === 'object') {
      const json = this.json as unknown as IRiskDataJson;

      if (json.type === QuantityTypeEnum.QUI) this.quiProb(json);
      if (json.type === QuantityTypeEnum.NOISE) this.noiseProb(json);
      if (json.type === QuantityTypeEnum.VFB) this.vibProb(json);
      if (json.type === QuantityTypeEnum.VL) this.vibLProb(json);
      if (json.type === QuantityTypeEnum.RADIATION) this.radProb(json);
      if (json.type === QuantityTypeEnum.HEAT) this.heatProb(json);
    }

    this.getProtocols();
    this.getBaseExams();
    this.setRecMedExamData(partial);
  }

  private getBaseExams() {
    if (this.riskFactor && this.riskFactor?.examToRisk && this.standardExams != false) {
      this.riskFactor?.examToRisk.forEach((examData) => {
        if (examData?.minRiskDegreeQuantity && this.isQuantity && this.level < examData?.minRiskDegreeQuantity) return;

        if (examData?.minRiskDegree && (!this.isQuantity || !examData?.minRiskDegreeQuantity) && this.level < examData?.minRiskDegree) return;

        if (!this.examsToRiskFactorData) this.examsToRiskFactorData = [];

        this.examsToRiskFactorData.push({
          examId: examData.examId,
          fromAge: examData.fromAge,
          isAdmission: examData.isAdmission,
          isChange: examData.isChange,
          isDismissal: examData.isDismissal,
          isFemale: examData.isFemale,
          isMale: examData.isMale,
          isPeriodic: examData.isPeriodic,
          isReturn: examData.isReturn,
          lowValidityInMonths: examData.lowValidityInMonths,
          considerBetweenDays: examData.considerBetweenDays,
          riskFactorDataId: this.id,
          toAge: examData.toAge,
          companyId: examData.companyId,
          validityInMonths: examData.validityInMonths,
          isStandard: true,
          exam: examData?.exam,
        });
      });
    }
  }

  private getProtocols() {
    if (this.riskFactor && this.riskFactor?.protocolToRisk) {
      this.riskFactor?.protocolToRisk.forEach((protocolRisk) => {
        if (this.level && protocolRisk?.minRiskDegreeQuantity && this.isQuantity && this.level < protocolRisk?.minRiskDegreeQuantity) return;

        if (this.level && protocolRisk?.minRiskDegree && (!this.isQuantity || !protocolRisk?.minRiskDegreeQuantity) && this.level < protocolRisk?.minRiskDegree) return;

        if (!this.protocolsToRisk) this.protocolsToRisk = [];

        this.protocolsToRisk.push(protocolRisk);
      });
    }
  }

  private setRecMedExamData(partial: Partial<RiskFactorDataEntity>) {
    if (!this.epis) this.epis = [];
    if (partial.epiToRiskFactorData) {
      this.epiToRiskFactorData = partial.epiToRiskFactorData.map((epiToRiskFactorData) => new EpiRiskDataEntity(epiToRiskFactorData));

      this.epis = this.epiToRiskFactorData.map(
        ({ epi, ...epiToRiskFactorData }) =>
          new EpiEntity({
            ...epi,
            epiRiskData: epiToRiskFactorData,
          }),
      );
    }

    if (!this.engs) this.engs = [];
    if (partial.engsToRiskFactorData) {
      this.engsToRiskFactorData = partial.engsToRiskFactorData.map((engsToRiskFactorData) => new EngsRiskDataEntity(engsToRiskFactorData));

      this.engs = this.engsToRiskFactorData.map(
        ({ recMed, ...engsToRiskFactorData }) =>
          new RecMedEntity({
            ...recMed,
            engsRiskData: engsToRiskFactorData,
          }),
      );
    }

    if (!this.exams) this.exams = [];
    if (partial.examsToRiskFactorData) {
      this.examsToRiskFactorData = partial.examsToRiskFactorData.map((examsToRiskFactorData) => new ExamRiskDataEntity(examsToRiskFactorData));

      this.exams = this.examsToRiskFactorData.map(
        ({ exam, ...examsToRiskFactorData }) =>
          new ExamEntity({
            ...exam,
            examsRiskData: examsToRiskFactorData,
          }),
      );
    }
  }

  private getMatrix() {
    if (this.riskFactor && this.riskFactor?.severity && this.probability) {
      const matrix = getMatrizRisk(this.riskFactor.severity, this.probability);

      this.level = matrix.level || this.level || 0;
      this.ro = matrix.label;
      this.intervention = matrix.intervention;
    }
  }

  private getOrigin() {
    if (this.homogeneousGroup) {
      if (this.homogeneousGroup.environment) this.origin = `${this.homogeneousGroup.environment.name}\n(${originRiskMap[this.homogeneousGroup.environment.type].name})`;

      if (this.homogeneousGroup.hierarchy && this.homogeneousGroup.hierarchy.name)
        this.origin = `${this.homogeneousGroup.hierarchy.name}\n(${originRiskMap[this.homogeneousGroup.hierarchy.type].name})`;

      if (this.homogeneousGroup.characterization)
        this.origin = `${this.homogeneousGroup.characterization.name}\n(${originRiskMap[this.homogeneousGroup.characterization.type].name})`;

      if (!this.homogeneousGroup.type) this.origin = `${this.homogeneousGroup.name}\n(GSE)`;
    }
  }

  private quiProb(data: IRiskDataJsonQui) {
    const isNr15Teto = data.nr15lt && data.nr15lt.includes('T');
    const isStelTeto = data.stel && data.stel.includes('C');
    const isTwaTeto = data.twa && data.twa.includes('C');
    const isVmpTeto = data.vmp && data.vmp.includes('T');

    const nr15ltProb = this.percentageCheck(data.nr15ltValue, data.nr15lt, isNr15Teto ? 1 : 5);
    const stelProb = this.percentageCheck(data.stelValue, data.stel, isStelTeto ? 1 : 5);
    const twaProb = this.percentageCheck(data.twaValue, data.twa, isTwaTeto ? 1 : 5);
    const vmpProb = this.percentageCheck(data.vmpValue, data.vmp, 1);

    this.intensity = this.convertNum(data.nr15ltValue);

    if (nr15ltProb || stelProb || twaProb || vmpProb) {
      this.isQuantity = true;
      this.probability = nr15ltProb || stelProb || twaProb || vmpProb || undefined;

      //! get max probability when some prop is passed
      // this.probability = Math.max(nr15ltProb, stelProb, twaProb, vmpProb) || undefined;

      (this.json as unknown as IRiskDataJsonQui).isNr15Teto = isNr15Teto;
      (this.json as unknown as IRiskDataJsonQui).isStelTeto = isStelTeto;
      (this.json as unknown as IRiskDataJsonQui).isTwaTeto = isTwaTeto;
      (this.json as unknown as IRiskDataJsonQui).isVmpTeto = isVmpTeto;

      (this.json as unknown as IRiskDataJsonQui).nr15ltProb = nr15ltProb;
      (this.json as unknown as IRiskDataJsonQui).stelProb = stelProb;
      (this.json as unknown as IRiskDataJsonQui).twaProb = twaProb;
      (this.json as unknown as IRiskDataJsonQui).vmpProb = vmpProb;
    }
  }

  private noiseProb(data: IRiskDataJsonNoise) {
    const limitQ3List = [75, 79, 82, 85, 115, 10000000];
    const limitQ5List = [64.4, 75, 80, 85, 115, 10000000];

    const ltcatq3 = this.valuesCheck(data.ltcatq3, limitQ3List);
    const ltcatq5 = this.valuesCheck(data.ltcatq5, limitQ5List);
    const nr15q5 = this.valuesCheck(data.nr15q5, limitQ5List);

    this.intensity = this.convertNum(data.nr15q5);

    if (ltcatq3 || ltcatq5 || nr15q5) {
      this.isQuantity = true;
      this.probability = Math.max(ltcatq3, ltcatq5, nr15q5) || undefined;
    }
  }

  private vibProb(data: IRiskDataJsonVibration) {
    const limitArenList = [0, 0.1, 0.5, 0.9, 1.101, 10000000000];
    const limitVdvrList = [0, 2.1, 9.1, 16.4, 21.01, 10000000000];

    const arenValue = this.valuesCheck(data?.aren, limitArenList);
    const vdvrValue = data?.vdvr ? this.valuesCheck(data?.vdvr, limitVdvrList) : 0;

    if (arenValue || vdvrValue) {
      const maxProb = Math.max(arenValue, vdvrValue);
      if (maxProb == arenValue) this.arenValue = this.convertNum(data.aren);
      if (maxProb == vdvrValue) this.vdvrValue = this.convertNum(data.vdvr);

      this.isQuantity = true;
      this.probAren = arenValue;
      this.probVdvr = vdvrValue;
      this.probability = Math.max(arenValue, vdvrValue) || undefined;
    }
  }

  private vibLProb(data: IRiskDataJsonVibration) {
    const limitArenList = [0, 0.5, 2.5, 3.5, 5.01, 10000000000];

    const arenValue = this.valuesCheck(data?.aren, limitArenList);
    this.arenValue = this.convertNum(data.aren);
    this.intensity = this.convertNum(data.aren);

    if (arenValue) {
      this.isQuantity = true;
      this.probAren = arenValue;
      this.probability = arenValue;
    }
  }

  private radProb(data: IRiskDataJsonRadiation) {
    this.intensity = this.convertNum(data.doseFB);

    const doseFB = this.percentageCheck(data.doseFB, '20');
    const doseFBPublic = this.percentageCheck(data.doseFBPublic, '1');

    const doseEye = this.percentageCheck(data.doseEye, '20');
    const doseEyePublic = this.percentageCheck(data.doseEyePublic, '15');

    const doseSkin = this.percentageCheck(data.doseSkin, '500');
    const doseSkinPublic = this.percentageCheck(data.doseSkinPublic, '50');

    const doseHand = this.percentageCheck(data.doseHand, '500');

    const prob = Math.max(doseFB, doseFBPublic, doseEye, doseEyePublic, doseSkin, doseHand, doseSkinPublic);
    if (prob) {
      this.isQuantity = true;
      this.probability = prob;

      if (doseFB) (this.json as unknown as IRiskDataJsonRadiation).doseFBProb = doseFB;
      if (doseFBPublic) (this.json as unknown as IRiskDataJsonRadiation).doseFBPublicProb = doseFBPublic;
      if (doseEye) (this.json as unknown as IRiskDataJsonRadiation).doseEyeProb = doseFB;
      if (doseEyePublic) (this.json as unknown as IRiskDataJsonRadiation).doseEyePublicProb = doseEyePublic;
      if (doseSkin) (this.json as unknown as IRiskDataJsonRadiation).doseSkinProb = doseSkin;
      if (doseSkinPublic) (this.json as unknown as IRiskDataJsonRadiation).doseSkinPublicProb = doseSkinPublic;
      if (doseSkinPublic) (this.json as unknown as IRiskDataJsonRadiation).doseSkinPublicProb = doseSkinPublic;
    }
  }

  private heatProb(data: IRiskDataJsonHeat) {
    const ibtug = Number(data?.ibtug || 0) + Number(data?.clothesType || 0);
    const mw = Number(data?.mw || 0);
    const isAcclimatized = !!data.isAcclimatized;

    if (!mw || !ibtug) return 0;
    if (ibtug) {
      const ibtugLEO = this.mapCheck(mw, 100, 606, heatTableLEOConstant);

      const getProb = () => {
        const ibtugTETO = this.mapCheck(mw, 240, 607, heatTableTETOConstant);
        if (ibtugTETO.ibtug <= ibtug) return 6;

        const ibtugNA = this.mapCheck(mw, 100, 602, heatTableNAConstant);

        if (!isAcclimatized) {
          const ibtugNAList = [ibtugNA.ibtug - 2, ibtugNA.ibtug - 1.5, ibtugNA.ibtug - 1, ibtugNA.ibtug - 0.5, ibtugNA.ibtug, 10000];

          return this.valuesCheck(String(ibtug), ibtugNAList, 5);
        }

        const ibtugLII = this.mapCheck(mw, 100, 606, heatTableLIIConstant);

        if (ibtug <= ibtugNA.ibtug) return 1;
        if (ibtug > ibtugNA.ibtug && ibtug <= ibtugLII.ibtugLII) return 2;

        if (ibtug > ibtugLEO.ibtug) return 5;
        if (ibtug >= ibtugLII.ibtugLSI && ibtug <= ibtugLEO.ibtug) return 4;
        if (ibtug > ibtugLII.ibtugLII && ibtug < ibtugLII.ibtugLSI) return 3;
      };

      const prob = getProb();
      if (prob) {
        this.isQuantity = true;
        this.ibtugLEO = ibtugLEO.ibtug;
        this.ibtug = ibtug;
        this.probability = prob;
        this.intensity = ibtug;
      }
    }
  }

  private percentageCheck(value: string, limit: string, maxLimitMultiplier?: number) {
    if (!value || !limit) return 0;

    value = value.replace(/[^0-9.]/g, '');
    limit = limit.replace(/[^0-9.]/g, '');

    const stage = Number(value) / Number(limit);
    if (stage < 0.1) return 1;
    if (stage < 0.25) return 2;
    if (stage < 0.5) return 3;
    if (stage < 1) return 4;
    if (maxLimitMultiplier && stage > maxLimitMultiplier) return 6;
    return 5;
  }

  private valuesCheck(value: string, limits: number[], highValue?: number) {
    if (!value || !limits.length) return 0;
    value = String(value).replace(/[^0-9.]/g, '');

    let returnValue = 0;

    for (let index = 0; index < limits.length; index++) {
      const actualValue = Number(value);
      if (actualValue < limits[index]) {
        returnValue = index + 1;
        break;
      }
    }

    return highValue && returnValue > highValue ? highValue : returnValue;
  }

  private mapCheck<T>(mw: number, min: number, max: number, map: Record<number, T>) {
    let valueMap: T;
    for (let index = 0; index < 100; index++) {
      const key = mw + index;
      if (key > max) {
        valueMap = map[max];
        break;
      }

      if (key < min) {
        valueMap = map[min];
        break;
      }

      const value = map[key];

      if (value) {
        valueMap = value;
        break;
      }
    }

    return valueMap;
  }

  private convertNum(value: string) {
    return Number(value);
  }
}
