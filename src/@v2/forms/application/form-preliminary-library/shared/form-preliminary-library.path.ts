import { IsString } from 'class-validator';

export class FormPreliminaryLibraryCompanyPath {
  @IsString()
  companyId!: string;
}

export class FormPreliminaryLibraryQuestionPath extends FormPreliminaryLibraryCompanyPath {
  @IsString()
  questionId!: string;
}

export class FormPreliminaryLibraryBlockPath extends FormPreliminaryLibraryCompanyPath {
  @IsString()
  blockId!: string;
}
