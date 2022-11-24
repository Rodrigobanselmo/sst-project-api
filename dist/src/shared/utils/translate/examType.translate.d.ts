export declare enum ExamHistoryTypeEnumTranslated {
    ADMI = "ADM",
    PERI = "PER",
    RETU = "RET",
    CHAN = "MUD",
    DEMI = "DEM"
}
export declare enum ExamHistoryTypeEnumNotes {
    ADMI = "Admissional",
    PERI = "Per\u00EDodico",
    RETU = "Retorno ao trabalho",
    CHAN = "Mudan\u00E7a de risco ocupacional",
    DEMI = "Demissional"
}
export declare const examHistoryTypeEnumTranslatedList: ExamHistoryTypeEnumTranslated[];
export declare const examHistoryTypeEnumTranslatedNotes: string[];
export declare const ExamHistoryTypeEnumTranslateBrToUs: (portugueseValue: string) => string;
export declare const ExamHistoryTypeEnumTranslateUsToBr: (portugueseValue: string) => string;
