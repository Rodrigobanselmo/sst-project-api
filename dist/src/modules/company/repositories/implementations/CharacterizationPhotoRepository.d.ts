import { PrismaService } from '../../../../prisma/prisma.service';
import { AddPhotoCharacterizationDto, UpdatePhotoCharacterizationDto } from '../../dto/characterization.dto';
import { CharacterizationPhotoEntity } from '../../entities/characterization-photo.entity';
export interface ICharacterizationPhoto extends Partial<AddPhotoCharacterizationDto> {
    photoUrl: string;
    isVertical: boolean;
    companyCharacterizationId: string;
    order?: number;
    name: string;
    id?: string;
}
export declare class CharacterizationPhotoRepository {
    private prisma;
    constructor(prisma: PrismaService);
    createMany(characterizationPhoto: ICharacterizationPhoto[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    update({ id, ...characterizationPhotoDto }: UpdatePhotoCharacterizationDto): Promise<CharacterizationPhotoEntity>;
    upsert({ id, companyCharacterizationId: characterizationId, ...characterizationPhotoDto }: ICharacterizationPhoto): Promise<CharacterizationPhotoEntity>;
    findByCharacterization(characterizationId: string): Promise<CharacterizationPhotoEntity[]>;
    findById(id: string): Promise<CharacterizationPhotoEntity>;
    delete(id: string): Promise<CharacterizationPhotoEntity>;
}
