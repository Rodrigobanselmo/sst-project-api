import { KeysOfEnum } from './../../../shared/utils/keysOfEnum.utils';
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AlignmentType, PageOrientation } from 'docx';
import { IBaseDocumentModel } from '../docx/builders/pgr/types/elements.types';

class DocVariables {
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsString()
  type: string;
}

class DocModelPageOrientation {
  @IsOptional()
  @IsString()
  @IsEnum(PageOrientation, {
    message: `orientatação deve ser ${KeysOfEnum(PageOrientation)}`,
  })
  orientation?: (typeof PageOrientation)[keyof typeof PageOrientation];
}

class DocModelPageMargin {
  @IsOptional()
  left?: number;

  @IsOptional()
  right?: number;

  @IsOptional()
  top?: number;

  @IsOptional()
  bottom?: number;
}

class DocModelPage {
  @IsOptional()
  @ValidateNested()
  margin?: DocModelPageMargin;

  @IsOptional()
  @ValidateNested()
  size?: DocModelPageOrientation;
}

class Base implements IBaseDocumentModel {
  @IsOptional()
  @IsString({ each: true })
  removeWithSomeEmptyVars?: string[];

  @IsOptional()
  @IsString({ each: true })
  removeWithAllEmptyVars?: string[];

  @IsOptional()
  @IsString({ each: true })
  removeWithAllValidVars?: string[];

  @IsOptional()
  @IsString({ each: true })
  addWithAllVars?: string[];
}

class DocumentModelElement extends Base {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsOptional()
  level?: number;

  @IsOptional()
  @IsOptional()
  size?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  @IsEnum(AlignmentType, {
    message: `orientatação deve ser ${KeysOfEnum(AlignmentType)}`,
  })
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
}

class DocumentModelSection extends Base {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @IsOptional()
  @ValidateNested()
  children?: DocumentModelElement[];

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  imgPath?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  text?: string;

  @IsOptional()
  footerText?: string;

  @IsOptional()
  @ValidateNested()
  properties?: {
    page?: DocModelPage;
  };
}

class DocumentModelGroup {
  @IsString()
  label: string;

  @ValidateNested({ each: true })
  data: DocumentModelSection[];

  @IsOptional()
  @ValidateNested()
  children?: Record<string, DocumentModelElement[]>;
}

class DocVariablesDTO {
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  isBoolean?: boolean;
}

class DocumentModelGroups {
  @ValidateNested()
  variables: Record<string, DocVariables>;

  @ValidateNested()
  sections: DocumentModelGroup[];
}

class DocumentModel {
  @ValidateNested()
  document: DocumentModelGroups;

  @ValidateNested()
  variables: Record<
    string,
    DocVariablesDTO & {
      active?: boolean;
      isBoolean?: boolean;
    }
  >;

  @ValidateNested()
  elements: Record<
    string,
    {
      type: string;
      label: string;
      text: string;
      active?: boolean;
      isParagraph?: boolean;
      isBullet?: boolean;
    }
  >;

  @ValidateNested()
  sections: Record<
    string,
    {
      type: string;
      label: string;
      active?: boolean;
      text?: string;
      isSection?: boolean;
      isBreakSection?: boolean;
    }
  >;
}
