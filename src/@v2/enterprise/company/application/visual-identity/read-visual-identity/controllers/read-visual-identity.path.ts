import { IsString } from 'class-validator'

export class ReadVisualIdentityPath {
  @IsString()
  companyId!: string
}

