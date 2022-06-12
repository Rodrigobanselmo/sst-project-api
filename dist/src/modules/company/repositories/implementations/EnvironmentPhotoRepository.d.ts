import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertPhotoEnvironmentDto } from '../../dto/environment.dto';
import { EnvironmentPhotoEntity } from '../../entities/environment-photo.entity';
interface IEnvironmentPhoto extends UpsertPhotoEnvironmentDto {
    photoUrl: string;
    environmentId: string;
}
export declare class EnvironmentPhotoRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ id, environmentId, ...environmentPhotoDto }: IEnvironmentPhoto): Promise<EnvironmentPhotoEntity>;
    delete(id: string, companyId: string, workspaceId: string): Promise<EnvironmentPhotoEntity>;
}
export {};
