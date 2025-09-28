import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class SendFormEmailPayload {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  participantIds?: number[];
}
