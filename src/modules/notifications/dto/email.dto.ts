import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EmailsTemplatesEnum } from 'src/shared/constants/enum/emailsTemplates';

import { KeysOfEnum } from './../../../shared/utils/keysOfEnum.utils';

export class EmailDto {
  @IsString()
  @IsEnum(EmailsTemplatesEnum, {
    message: `templates disponíveis: ${KeysOfEnum(EmailsTemplatesEnum)}`,
  })
  template: EmailsTemplatesEnum;
}
