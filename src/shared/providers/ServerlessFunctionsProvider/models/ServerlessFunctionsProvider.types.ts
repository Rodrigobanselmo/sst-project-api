import { ISectionOptions } from 'docx';
import { IPropertiesOptions } from 'docx/build/file/core-properties';

export interface IResposeLambdaBody {
  message?: string;
  erros?: any;
}

export interface IResposeLambda<T> {
  statusCode: number;
  body: IResposeLambdaBody & T;
}

export interface ICreateDocumentProps {
  body: {
    isDev: boolean;
    sections?: ISectionOptions[];
    docOptions?: Omit<IPropertiesOptions, 'sections'>;
    fileName?: string;
    s3BodyKey?: string;
    isPublic?: boolean;
  };
}

export type ICreateDocumentReturn = {
  url: string;
};

export type ICreateDocumentFuncReturn = IResposeLambda<{
  url: string;
}>;
