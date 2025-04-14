import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormApplicationBrowseResultModel } from '@/@v2/forms/domain/models/form-application/form-application-browse-result.model';

export type IFormApplicationBrowseResultModelMapper = {
  id: number;
  name: string;
  description: string | null;
  status: FormStatusEnum;
  end_date: Date | null;
  start_date: Date | null;
  created_at: Date;
  updated_at: Date;
  companyId: string;
  total_answers: number;
  total_participants: number;

  form_id: number;
  form_name: string;
  form_type: FormTypeEnum;
  form_system: boolean;
};

export class FormApplicationBrowseResultModelMapper {
  static toModel(prisma: IFormApplicationBrowseResultModelMapper): FormApplicationBrowseResultModel {
    return new FormApplicationBrowseResultModel({
      id: prisma.id,
      name: prisma.name,
      description: prisma.description || undefined,
      status: prisma.status,
      endDate: prisma.end_date || undefined,
      startDate: prisma.start_date || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      companyId: prisma.companyId,
      totalAnswers: prisma.total_answers,
      totalParticipants: prisma.total_participants,
      form: {
        id: prisma.form_id,
        name: prisma.form_name,
        type: FormTypeEnum[prisma.form_type],
        system: prisma.form_system,
      },
    });
  }

  static toModels(prisma: IFormApplicationBrowseResultModelMapper[]): FormApplicationBrowseResultModel[] {
    return prisma.map((rec) => FormApplicationBrowseResultModelMapper.toModel(rec));
  }
}
