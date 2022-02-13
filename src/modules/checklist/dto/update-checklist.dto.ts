import { PartialType } from '@nestjs/swagger';
import { CreateChecklistDto } from './create-checklist.dto';

export class UpdateChecklistDto extends PartialType(CreateChecklistDto) {}
