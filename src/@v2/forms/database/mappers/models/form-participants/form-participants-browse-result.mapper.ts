import { FormParticipantsBrowseResultModel } from '@/@v2/forms/domain/models/form-participants/form-participants-browse-result.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';

export type IFormParticipantsBrowseResultModelMapper = {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string | null;
  status: string;
  company_id: string;
  hierarchy_id: string;
  hierarchy_name: string;
  hierarchy_type: string;
  h_parent_1_id: string | null;
  h_parent_1_name: string | null;
  h_parent_1_type: string | null;
  h_parent_2_id: string | null;
  h_parent_2_name: string | null;
  h_parent_2_type: string | null;
  h_parent_3_id: string | null;
  h_parent_3_name: string | null;
  h_parent_3_type: string | null;
  h_parent_4_id: string | null;
  h_parent_4_name: string | null;
  h_parent_4_type: string | null;
  h_parent_5_id: string | null;
  h_parent_5_name: string | null;
  h_parent_5_type: string | null;
  has_responded: boolean;
  email_sent: boolean;
  email_sent_at: Date | null;
  hierarchy_sort_name: string | null;
  created_at: Date;
  updated_at: Date;
};

export class FormParticipantsBrowseResultModelMapper {
  static toModel(prisma: IFormParticipantsBrowseResultModelMapper, cryptoAdapter: CryptoAdapter): FormParticipantsBrowseResultModel {
    // Build hierarchies array from current hierarchy and parents
    const hierarchies = [];

    // Add current hierarchy
    if (prisma.hierarchy_id && prisma.hierarchy_name && prisma.hierarchy_type) {
      hierarchies.push({
        id: prisma.hierarchy_id,
        name: prisma.hierarchy_name,
        type: HierarchyTypeEnum[prisma.hierarchy_type as keyof typeof HierarchyTypeEnum],
      });
    }

    // Add parent hierarchies in order
    const parents = [
      { id: prisma.h_parent_1_id, name: prisma.h_parent_1_name, type: prisma.h_parent_1_type },
      { id: prisma.h_parent_2_id, name: prisma.h_parent_2_name, type: prisma.h_parent_2_type },
      { id: prisma.h_parent_3_id, name: prisma.h_parent_3_name, type: prisma.h_parent_3_type },
      { id: prisma.h_parent_4_id, name: prisma.h_parent_4_name, type: prisma.h_parent_4_type },
      { id: prisma.h_parent_5_id, name: prisma.h_parent_5_name, type: prisma.h_parent_5_type },
    ];

    parents.forEach((parent) => {
      if (parent.id && parent.name && parent.type) {
        hierarchies.push({
          id: parent.id,
          name: parent.name,
          type: HierarchyTypeEnum[parent.type as keyof typeof HierarchyTypeEnum],
        });
      }
    });

    return new FormParticipantsBrowseResultModel({
      id: prisma.id,
      name: prisma.name,
      cpf: prisma.cpf,
      email: prisma.email,
      phone: prisma.phone,
      status: prisma.status,
      companyId: prisma.company_id,
      hierarchyId: prisma.hierarchy_id,
      hierarchyName: prisma.hierarchy_name,
      hierarchies,
      hasResponded: prisma.has_responded,
      emailSent: prisma.email_sent,
      emailSentAt: prisma.email_sent_at,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      encryptedEmployeeId: cryptoAdapter.encryptNumber(prisma.id),
    });
  }

  static toModels(prisma: IFormParticipantsBrowseResultModelMapper[], cryptoAdapter: CryptoAdapter): FormParticipantsBrowseResultModel[] {
    return prisma.map((rec) => FormParticipantsBrowseResultModelMapper.toModel(rec, cryptoAdapter));
  }
}
