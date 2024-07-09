import { riskAllId } from './../../../../../shared/constants/ids';
import { PrismaService } from './../../../../../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class DeleteCompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(user: UserPayloadDto, option?: { clinic?: boolean }) {
    const company = await this.companyRepository.findFirstNude({
      where: { id: user.targetCompanyId, isClinic: !!option?.clinic },
      select: {
        id: true,
        isClinic: true,
        documentModels: { select: { id: true } },
        users: { select: { userId: true } },
        riskFactors: { select: { id: true } },
        recMed: { select: { id: true } },
        exams: { select: { id: true } },
        riskFactorDocument: { select: { id: true } },
        riskFactorData: { select: { id: true }, where: { riskId: { not: riskAllId } } },
        protocol: { select: { id: true } },
        examClinicHistory: { select: { id: true } },
        esocialEvents: { select: { id: true } },
        esocialTransmissions: { select: { id: true } },
        documents: { select: { id: true } },
        companiesToClinicAvailable: { select: { clinicId: true } },
        applyingServiceContracts: {
          where: { status: 'ACTIVE' },
          select: { receivingServiceCompanyId: true },
        },
        cert: { select: { id: true } },
        // clinicExams: { select: { id: true } },
        characterization: { select: { id: true }, where: { photos: { some: { id: { gte: '' } } } } },
      },
    });

    const id = user.targetCompanyId;
    const initText = !option?.clinic ? 'Empresa' : 'Clínica';

    if (!company.id) throw new BadRequestException(`${initText} não encontrado, ou sem perissoões para excluir`);

    if (option?.clinic) {
      const examsConected = await this.prisma.employeeExamsHistory.findFirst({
        where: { clinicId: id },
        select: { id: true },
      });
      if (examsConected?.id)
        throw new BadRequestException(`${initText} possui exames realizados, não pode ser excluída`);
    }

    if (company.applyingServiceContracts?.length)
      throw new BadRequestException(
        `${initText} possui contratos de prestação de serviço com otras empresas, não pode ser excluída`,
      );
    if (company.users?.length) throw new BadRequestException(`${initText} possui usuários, não pode ser excluída`);
    if (company.documentModels?.length)
      throw new BadRequestException(`${initText} possui modelos de documentos, não pode ser excluída`);
    // if (company.riskFactors?.length) throw new BadRequestException(`${initText} possui fatores de risco, não pode ser excluída`);
    // if (company.recMed?.length) throw new BadRequestException(`${initText} possui medidas de controle, não pode ser excluída`);
    // if (company.exams?.length) throw new BadRequestException(`${initText} possui exames, não pode ser excluída`);
    if (company.cert?.id) throw new BadRequestException(`${initText} possui certificado, não pode ser excluída`);
    // if (company.riskFactorDocument?.length) throw new BadRequestException(`${initText} possui documentos, não pode ser excluída`);
    if (company.riskFactorData?.length)
      throw new BadRequestException(`${initText} possui dados de fatores de risco, não pode ser excluída`);
    // if (company.protocol?.length) throw new BadRequestException(`${initText} possui protocolo, não pode ser excluída`);
    if (company.examClinicHistory?.length)
      throw new BadRequestException(`${initText} possui histórico de exames, não pode ser excluída`);
    if (company.esocialEvents?.length)
      throw new BadRequestException(`${initText} possui eventos do eSocial, não pode ser excluída`);
    if (company.esocialTransmissions?.length)
      throw new BadRequestException(`${initText} possui transmissões do eSocial, não pode ser excluída`);
    if (company.documents?.length)
      throw new BadRequestException(`${initText} possui documentos, não pode ser excluída`);
    // if (company.clinicExams?.length) throw new BadRequestException(`${initText} possui exames clínicos, não pode ser excluída`);
    // if (company.companiesToClinicAvailable?.length) throw new BadRequestException(`${initText} possui empresas vinculadas, não pode ser excluída`);
    if (company.characterization?.length)
      throw new BadRequestException(`${initText} possui fotos cadastradas em ambientes, não pode ser excluída`);

    await this.softDelete(id);

    return company;
  }

  async softDelete(id: string) {
    await this.companyRepository.update({ companyId: id, status: 'INACTIVE', deleted_at: new Date() });
  }

  async hardDelete(id: string) {
    await this.prisma.examToRisk.deleteMany({ where: { companyId: id } });
    await this.prisma.contact.deleteMany({ where: { companyId: id } });
    await this.prisma.engsToRiskFactorData.deleteMany({ where: { riskFactorData: { companyId: id } } });
    await this.prisma.epiToRiskFactorData.deleteMany({ where: { riskFactorData: { companyId: id } } });
    await this.prisma.examToRiskData.deleteMany({ where: { risk: { companyId: id } } });
    await this.prisma.employeeHierarchyHistory.deleteMany({ where: { employee: { companyId: id } } });
    await this.prisma.attachments.deleteMany({ where: { riskFactorDocument: { companyId: id } } });
    await this.prisma.riskFactorsDocInfo.deleteMany({ where: { companyId: id } });
    await this.prisma.databaseTable.deleteMany({ where: { companyId: id } });
    await this.prisma.employee.deleteMany({ where: { companyId: id } });
    await this.prisma.hierarchyOnHomogeneous.deleteMany({ where: { hierarchy: { companyId: id } } });
    await this.prisma.companyCharacterization.deleteMany({
      where: { OR: [{ companyId: id }, { homogeneousGroup: { companyId: id } }] },
    });
    await this.prisma.companyEnvironment.deleteMany({
      where: { OR: [{ companyId: id }, { homogeneousGroup: { companyId: id } }] },
    });
    await this.prisma.homogeneousGroup.deleteMany({ where: { companyId: id } });
    await this.prisma.hierarchy.deleteMany({ where: { companyId: id } });
    await this.prisma.workspace.deleteMany({ where: { companyId: id } });
    await this.prisma.companyClinics.deleteMany({ where: { companyId: id } });
    await this.prisma.contract.deleteMany({ where: { receivingServiceCompanyId: id } });
    await this.prisma.inviteUsers.deleteMany({ where: { companyId: id } });
    await this.prisma.companyReport.deleteMany({ where: { companyId: id } });
    await this.prisma.riskFactorGroupData.deleteMany({ where: { companyId: id } });
    await this.prisma.company.delete({ where: { id } });
  }
}
