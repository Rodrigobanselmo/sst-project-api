import { IsString } from 'class-validator';

export class PublicSubmitFormApplicationPath {
  @IsString()
  applicationId!: string;
}
