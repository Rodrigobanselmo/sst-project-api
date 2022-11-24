export interface IESocialPropsDto {
    processing?: number;
    pending?: number;
    done?: number;
    transmitted?: number;
    rejected?: number;
}
export interface DailyCompanyReportDto {
    exam: {
        good?: number;
        expired?: number;
        schedule?: number;
        all?: number;
        expired30?: number;
        expired90?: number;
    };
    esocial: {
        processing?: number;
        pending?: number;
        done?: number;
        transmitted?: number;
        rejected?: number;
        ['S2240']?: IESocialPropsDto;
        ['S2220']?: IESocialPropsDto;
        ['S2210']?: IESocialPropsDto;
    };
}
export declare class UpsertCompanyReportDto {
    id?: number;
    companyId?: string;
    lastDailyReport?: Date;
    dailyReport?: DailyCompanyReportDto;
}
