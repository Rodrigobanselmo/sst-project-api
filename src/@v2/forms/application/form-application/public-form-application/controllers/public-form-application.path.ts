import { IsString } from 'class-validator';

export class PublicFormApplicationPath {
  @IsString()
  applicationId!: string;
}
