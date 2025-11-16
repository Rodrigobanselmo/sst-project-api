import { IsString } from 'class-validator';

export class PublicFormParticipantLoginPath {
  @IsString()
  applicationId!: string;
}
