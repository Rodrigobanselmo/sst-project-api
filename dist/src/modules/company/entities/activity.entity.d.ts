import { Activity } from '@prisma/client';
export declare class ActivityEntity implements Activity {
    id: number;
    code: string;
    name: string;
    created_at: Date;
    riskDegree: number;
    constructor(partial: Partial<ActivityEntity>);
}
