import { checkRiskDataDoc } from './../../../../../shared/utils/getRiskDoc';
import { HierarchyEntity } from './../../../../company/entities/hierarchy.entity';
import { FindAllRiskDataByEmployeeService } from './../../../../sst/services/risk-data/find-by-employee/find-by-employee.service';
import { Injectable } from '@nestjs/common';
import { SexTypeEnum } from '@prisma/client';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EmployeeEntity } from '../../../../company/entities/employee.entity';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { IPdfProntuarioData, IProntuarioQuestion } from './types/IProntuarioData.type';
import { onGetRisks } from '../../../../../shared/utils/onGetRisks';

//TODO: add doneExams on prontuario para aparecer no Prontuario
@Injectable()
export class PdfProntuarioDataService {
  constructor(private readonly employeeRepository: EmployeeRepository, private readonly findAllRiskDataByEmployeeService: FindAllRiskDataByEmployeeService) { }
  async execute(employeeId: number, userPayloadDto: UserPayloadDto, options?: { isAvaliation?: boolean }): Promise<IPdfProntuarioData> {
    const companyId = userPayloadDto.targetCompanyId;

    const employeeData = await this.employeeRepository.findFirstNude({
      where: {
        id: employeeId,
        OR: [{ examsHistory: { some: { clinicId: companyId } } }, { companyId: companyId }],
      },
      select: {
        name: true,
        cpf: true,
        socialName: true,
        birthday: true,
        rg: true,
        sex: true,
        company: {
          select: {
            name: true,
            initials: true,
            logoUrl: true,
            cnpj: true,
            doctorResponsible: { select: { councilId: true, councilType: true, councilUF: true, professional: { select: { name: true } } } },
            group: {
              select: {
                doctorResponsible: { select: { councilId: true, councilType: true, councilUF: true, professional: { select: { name: true } } } },
              },
            },
            contacts: { select: { phone: true, id: true, isPrincipal: true, email: true }, take: 1, orderBy: { isPrincipal: 'desc' } },
            receivingServiceContracts: {
              select: {
                applyingServiceCompany: {
                  select: {
                    initials: true,
                    id: true,
                    name: true,
                    cnpj: true,
                    logoUrl: true,
                    fantasy: true,
                    contacts: { select: { phone: true, id: true, isPrincipal: true, email: true }, take: 1, orderBy: { isPrincipal: 'desc' } },
                  },
                },
              },
              where: {
                applyingServiceCompany: {
                  isConsulting: true,
                  isGroup: false,
                  license: { status: 'ACTIVE' },
                },
              },
            },
          },
        },
        examsHistory: {
          where: { status: { in: ['PROCESSING', 'DONE'] }, exam: { isAttendance: true, ...(options?.isAvaliation && { isAvaliation: true, isAttendance: false }) } },
          select: { doneDate: true, changeHierarchyDate: true, examId: true, examType: true },
          orderBy: { doneDate: 'desc' },
          take: 1,
        },
        hierarchyHistory: {
          where: { motive: 'ADM' },
          select: { startDate: true },
          orderBy: { startDate: 'desc' },
          take: 1,
        },
      },
    });

    const admissionDate = employeeData?.hierarchyHistory?.[0]?.startDate || employeeData?.examsHistory[0]?.changeHierarchyDate || employeeData?.examsHistory[0]?.doneDate;
    const { risk: riskData, employee: employeeRisk } = await this.findAllRiskDataByEmployeeService.getRiskData(employeeId, undefined, {
      fromExam: true,
      hierarchyData: true,
      filterDate: true,
    });

    const questions = await this.getQuestions(employeeData, companyId);
    const examination = await this.getExamination(employeeData, companyId);

    const asoRiskData = checkRiskDataDoc(riskData, { docType: 'isAso', companyId: companyId });
    const asoRisk = onGetRisks(asoRiskData);
    const employee = { ...employeeRisk, ...employeeData };

    const consultantCompany = employee?.company?.receivingServiceContracts?.[0]?.applyingServiceCompany;
    const actualCompany = employee.company;
    const sector = this.onGetSector(employee?.hierarchy);
    const clinicExam = employee.examsHistory[0];

    const doctorResponsible = actualCompany.doctorResponsible;

    return {
      questions,
      examination,
      employee,
      doctorResponsible,
      sector,
      clinicExam,
      actualCompany,
      consultantCompany,
      admissionDate,
      risks: asoRisk.map((risk) => ({ riskData: risk.riskData[0], riskFactor: risk.riskFactor })),
    };
  }

  getQuestions(employee: EmployeeEntity, companyId: string) {
    const questions: IProntuarioQuestion[] = [
      { name: 'Estado de saúde atual?', textAnswer: '' },
      { name: 'Fuma?', textAnswer: 'Frequência:', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Álcool?', textAnswer: 'Frequência:', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Pratica esporte ou lazer?', textAnswer: 'Frequência:', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Diabetes?', textAnswer: 'Medicação:', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Pressão alta?', textAnswer: 'Medicação:', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Varizes', textAnswer: 'Tratamento:', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Hérnia', textAnswer: 'Tratamento:', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Alergia', textAnswer: 'A que ?', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Faz uso regular de medicação?', textAnswer: 'Qual ?', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Faz acompanhamento médico?', textAnswer: 'Especialização:', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Fez alguma cirurgia?', textAnswer: 'Por quê?Quando?', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Ficou internado?', textAnswer: 'Por quê?Quando?', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Escuta bem', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Enxerga bem', textAnswer: 'Usa lentes corretivas?', objectiveAnswer: ['Sim', 'Não'] },
      { name: 'Data da última menstruação?', textAnswer: 'Data:', sex: SexTypeEnum.F },
      { name: 'Gestações e partos?', textAnswer: '', sex: SexTypeEnum.F },
    ].filter((q) => !q.sex || q.sex == employee.sex);

    return questions;
  }

  getExamination(employee: EmployeeEntity, companyId: string) {
    const examination = (
      [
        { name: 'Aparelho Cardíaco normal?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
        { name: 'Aparelho pulmonar normal?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
        { name: 'Coluna normal?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
        { name: 'Abdomen normal?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
        { name: 'Afecções dermatológicas?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
        { name: 'MMSS normais?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
        { name: 'MMII normais?', textAnswer: '', objectiveAnswer: ['Sim', 'Não'] },
      ] as IProntuarioQuestion[]
    ).filter((q) => !q.sex || q.sex == employee.sex);

    return examination;
  }

  onGetSector(hierarchy: Partial<HierarchyEntity>) {
    return hierarchy?.parents?.find((parent) => parent.type == 'SECTOR');
    // this.hierarchyRepository.findFirstNude({where:{type:'SECTOR', children:{some:{}}}})
  }
}
