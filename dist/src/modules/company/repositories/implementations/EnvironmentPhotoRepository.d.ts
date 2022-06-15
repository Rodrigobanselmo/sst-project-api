import { PrismaService } from '../../../../prisma/prisma.service';
import { AddPhotoEnvironmentDto } from '../../dto/environment.dto';
import { EnvironmentPhotoEntity } from '../../entities/environment-photo.entity';
export interface IEnvironmentPhoto extends Partial<AddPhotoEnvironmentDto> {
    photoUrl: string;
    companyEnvironmentId: string;
    name: string;
    id?: string;
}
export declare class EnvironmentPhotoRepository {
    private prisma;
    constructor(prisma: PrismaService);
    createMany(environmentPhoto: IEnvironmentPhoto[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    upsert({ id, companyEnvironmentId: environmentId, ...environmentPhotoDto }: IEnvironmentPhoto): Promise<EnvironmentPhotoEntity>;
    findById(id: string): Promise<EnvironmentPhotoEntity>;
    delete(id: string): Promise<EnvironmentPhotoEntity>;
}
