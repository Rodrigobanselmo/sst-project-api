import { IsString, Matches } from 'class-validator';

export class PublicFormParticipantLoginPayload {
  @IsString()
  cpf!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Birthday must be in yyyy-mm-dd format',
  })
  birthday!: string;
}
