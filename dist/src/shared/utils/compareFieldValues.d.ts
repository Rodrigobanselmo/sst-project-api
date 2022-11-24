import { UpdateEmployeeExamHistoryDto } from './../../modules/company/dto/employee-exam-history';
export declare const compareFieldValues: (object1: any, object2: any, options?: {
    fields?: string[];
    ignoreFields?: string[];
    skipUndefined?: boolean;
}) => boolean;
export declare const checkExamFields: (keyof UpdateEmployeeExamHistoryDto)[];
