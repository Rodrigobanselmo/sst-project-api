import { PrismaService } from '../../../../prisma/prisma.service';
import { AddPhotoEnvironmentDto, UpdatePhotoEnvironmentDto } from '../../dto/environment.dto';
import { EnvironmentPhotoEntity } from '../../entities/environment-photo.entity';
export interface IEnvironmentPhoto extends Partial<AddPhotoEnvironmentDto> {
    photoUrl: string;
    isVertical: boolean;
    companyCharacterizationId: string;
    name: string;
    id?: string;
}
export declare class EnvironmentPhotoRepository {
    private prisma;
    constructor(prisma: PrismaService);
    createMany(environmentPhoto: IEnvironmentPhoto[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    update({ id, ...environmentPhotoDto }: UpdatePhotoEnvironmentDto): Promise<EnvironmentPhotoEntity>;
    findById(id: string): Promise<EnvironmentPhotoEntity>;
    findByEnvironment(environmentId: string): Promise<EnvironmentPhotoEntity[]>;
    delete(id: string): Promise<EnvironmentPhotoEntity>;
}
