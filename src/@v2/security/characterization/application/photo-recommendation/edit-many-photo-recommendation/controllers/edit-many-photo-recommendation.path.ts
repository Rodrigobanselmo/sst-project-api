import { IsString } from 'class-validator';

export class EditPhotoRecommendationPath {
  @IsString()
  companyId!: string;
}
