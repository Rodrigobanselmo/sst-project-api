import { Company, AddressCompany, DocumentCover, Activity } from '@prisma/client';
import { CompanyModel } from '../../domain/models/company.model';
import { AddressModel } from '../../domain/models/address.model';
import { CoverModel } from '../../domain/models/cover.model';
import { CoverTypeEnum } from '@/@v2/shared/domain/enum/company/cover-type.enum';
import { CompanyDocumentsCoverVO } from '@/@v2/shared/domain/values-object/company/company-document-cover.vo';
import { ConsultantModel } from '../../domain/models/consultant.model';

export type ICompanyMapper = Company & {
  address: AddressCompany | null;
  primary_activity: Activity[];
  covers: DocumentCover[];
  receivingServiceContracts: {
    applyingServiceCompany: Company & {
      address: AddressCompany | null;
      covers: DocumentCover[];
    };
  }[];
};

export class CompanyMapper {
  static toModel(data: ICompanyMapper): CompanyModel {
    const consultant = data.receivingServiceContracts.find((consult) => !consult?.applyingServiceCompany?.isGroup)?.applyingServiceCompany || null;
    const primaryActivity = data.primary_activity[0];

    const covers = data.covers.map((cover) => {
      // Handle both formats: { coverProps: {...} } and { logoProps: {...}, ... }
      const jsonData = cover.json as any;
      const coverData = jsonData?.coverProps || jsonData;

      return new CoverModel({
        types: cover.acceptType.map((type) => CoverTypeEnum[type]),
        data: new CompanyDocumentsCoverVO(coverData),
      });
    });

    if (covers.length === 0) {
      const cover = new CoverModel({
        data: new CompanyDocumentsCoverVO({
          backgroundImagePath: 'images/cover/simple.png',
          logoProps: { x: 160, y: 58, maxLogoWidth: 212, maxLogoHeight: 141 },
          titleProps: { x: 103, y: 310, boxX: 464, boxY: 0, size: 28, color: '000000' },
          companyProps: { x: 103, y: 510, boxX: 464, boxY: 0, size: 14, color: '000000' },
          versionProps: { x: 103, y: 480, boxX: 464, boxY: 0, size: 14, color: '000000' },
        }),
        types: [CoverTypeEnum.PGR, CoverTypeEnum.PCSMO],
      });

      covers.push(cover);
    }

    return new CompanyModel({
      id: data.id,
      name: data.name,
      cnpj: data.cnpj || '00000000000000',
      address: data.address ? new AddressModel(data.address) : null,
      email: data.email,
      fantasyName: data.fantasy,
      initials: data.initials,
      logoUrl: data.logoUrl,
      mission: data.mission,
      vision: data.vision,
      values: data.values,
      shortName: data.shortName,
      responsibleName: data.responsibleName,
      primaryActivityCode: primaryActivity.code,
      primaryActivityRiskDegree: primaryActivity.riskDegree,
      primaryActivityName: primaryActivity.name,
      operationTime: data.operationTime,
      phone: data.phone,
      covers,
      consultant: consultant
        ? new ConsultantModel({
            address: consultant.address ? new AddressModel(consultant.address) : null,
            logoUrl: consultant.logoUrl,
            name: consultant.name,
            covers: consultant.covers.map((cover) => {
              const jsonData = cover.json as any;
              const coverData = jsonData?.coverProps || jsonData;

              return new CoverModel({
                types: cover.acceptType.map((type) => CoverTypeEnum[type]),
                data: new CompanyDocumentsCoverVO(coverData),
              });
            }),
          })
        : null,
    });
  }
}
