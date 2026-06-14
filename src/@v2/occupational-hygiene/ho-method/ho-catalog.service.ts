import { Inject, Injectable, BadRequestException, ConflictException } from '@nestjs/common';

import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { IFileRequester } from '@/@v2/shared/requesters/files/file.interface';
import { checkIsValidCnpj } from '@/shared/utils/validators/checkIsValidCnpj';

import {
  mapHoExtractionSolventRecord,
  mapHoLaboratoryRecord,
  mapHoSamplerRecord,
} from '../ho-method/ho-method.mapper';

@Injectable()
export class HoSamplerService {
  constructor(private readonly prisma: PrismaServiceV2) {}

  browse(search?: string) {
    return this.prisma.hoSampler.findMany({
      where: {
        deleted_at: null,
        active: true,
        ...(search?.trim()
          ? {
              OR: [
                { name: { contains: search.trim(), mode: 'insensitive' } },
                { description: { contains: search.trim(), mode: 'insensitive' } },
                { type: { contains: search.trim(), mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
      take: search?.trim() ? 100 : 500,
    }).then((rows) => rows.map(mapHoSamplerRecord));
  }

  create(input: { name: string; description?: string; type?: string; notes?: string }) {
    return this.prisma.hoSampler
      .create({
        data: {
          name: input.name.trim(),
          description: input.description?.trim() || null,
          type: input.type?.trim() || null,
          notes: input.notes?.trim() || null,
        },
      })
      .then(mapHoSamplerRecord)
      .catch((error) => {
        if (error?.code === 'P2002') {
          throw new ConflictException('Já existe um amostrador com este nome.');
        }
        throw error;
      });
  }
}

@Injectable()
export class HoExtractionSolventService {
  constructor(private readonly prisma: PrismaServiceV2) {}

  browse(search?: string) {
    return this.prisma.hoExtractionSolvent.findMany({
      where: {
        deleted_at: null,
        active: true,
        ...(search?.trim()
          ? {
              OR: [
                { name: { contains: search.trim(), mode: 'insensitive' } },
                { description: { contains: search.trim(), mode: 'insensitive' } },
                { synonyms: { has: search.trim() } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
      take: search?.trim() ? 100 : 500,
    }).then((rows) => rows.map(mapHoExtractionSolventRecord));
  }

  create(input: {
    name: string;
    description?: string;
    synonyms?: string[];
    notes?: string;
  }) {
    return this.prisma.hoExtractionSolvent
      .create({
        data: {
          name: input.name.trim(),
          description: input.description?.trim() || null,
          synonyms: input.synonyms ?? [],
          notes: input.notes?.trim() || null,
        },
      })
      .then(mapHoExtractionSolventRecord)
      .catch((error) => {
        if (error?.code === 'P2002') {
          throw new ConflictException('Já existe um solvente com este nome.');
        }
        throw error;
      });
  }
}

@Injectable()
export class HoMethodFileService {
  constructor(
    @Inject(SharedTokens.FileRequester)
    private readonly fileRequester: IFileRequester,
  ) {}

  async upload(params: {
    companyId: string;
    buffer: Buffer;
    name: string;
    size: number;
  }) {
    const [file, error] = await this.fileRequester.add({
      companyId: params.companyId,
      buffer: params.buffer,
      fileName: params.name,
      fileFolder: 'v2/company/:companyId/ho-methods/',
      size: params.size,
      shouldDelete: false,
    });

    if (error || !file) {
      throw error ?? new Error('Não foi possível enviar o arquivo.');
    }

    return {
      fileId: file.id,
      name: file.name,
      url: file.url,
      uploadedAt: new Date().toISOString(),
    };
  }
}

@Injectable()
export class HoLaboratoryService {
  constructor(private readonly prisma: PrismaServiceV2) {}

  browse(search?: string) {
    const term = search?.trim();

    return this.prisma.hoLaboratory
      .findMany({
        where: {
          deleted_at: null,
          status: 'ACTIVE',
          ...(term
            ? {
                OR: [
                  { corporateName: { contains: term, mode: 'insensitive' } },
                  { tradeName: { contains: term, mode: 'insensitive' } },
                  ...(checkIsValidCnpj(term)
                    ? [{ cnpj: checkIsValidCnpj(term) as string }]
                    : []),
                ],
              }
            : {}),
        },
        orderBy: [{ tradeName: 'asc' }, { corporateName: 'asc' }],
        take: term ? 100 : 500,
      })
      .then((rows) => rows.map(mapHoLaboratoryRecord));
  }

  async create(input: {
    cnpj?: string;
    corporateName: string;
    tradeName?: string;
    email?: string;
    phone?: string;
    contactName?: string;
    notes?: string;
  }) {
    const corporateName = input.corporateName?.trim();
    if (!corporateName) {
      throw new BadRequestException('Informe a razão social do laboratório.');
    }

    const normalizedCnpj = input.cnpj?.trim()
      ? (checkIsValidCnpj(input.cnpj) || null)
      : null;

    if (input.cnpj?.trim() && !normalizedCnpj) {
      throw new BadRequestException('CNPJ inválido.');
    }

    if (normalizedCnpj) {
      const existing = await this.prisma.hoLaboratory.findFirst({
        where: {
          cnpj: normalizedCnpj,
          deleted_at: null,
        },
      });

      if (existing) {
        return mapHoLaboratoryRecord(existing);
      }
    }

    return this.prisma.hoLaboratory
      .create({
        data: {
          cnpj: normalizedCnpj,
          corporateName,
          tradeName: input.tradeName?.trim() || null,
          email: input.email?.trim() || null,
          phone: input.phone?.trim() || null,
          contactName: input.contactName?.trim() || null,
          notes: input.notes?.trim() || null,
        },
      })
      .then(mapHoLaboratoryRecord)
      .catch((error) => {
        if (error?.code === 'P2002') {
          throw new ConflictException(
            'Já existe um laboratório cadastrado com este CNPJ.',
          );
        }
        throw error;
      });
  }
}
