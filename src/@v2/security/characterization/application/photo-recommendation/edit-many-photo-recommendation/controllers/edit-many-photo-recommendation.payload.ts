import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class EditPhotoRecommendationPayload {
  @IsString()
  riskDataId!: string;

  @IsArray()
  @IsString({ each: true })
  photoIds!: string[];

  @IsString()
  recommendationId!: string;

  @IsBoolean()
  @Type(() => Boolean)
  isVisible!: boolean;
}
