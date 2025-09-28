import { IsOptional, IsString } from 'class-validator';

export class PublicFormApplicationQuery {
  @IsOptional()
  @IsString()
  encrypt?: string;
}
