import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { WorkspaceRepository } from '../../../repositories/implementations/WorkspaceRepository';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';

@Injectable()
export class AddWorkspacePhotoService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(workspaceId: string, userPayloadDto: UserPayloadDto, file: any) {
    const companyId = userPayloadDto.targetCompanyId;
    const photoUrl = await this.upload(file);

    await this.workspaceRepository.update(workspaceId, {
      logoUrl: photoUrl,
    });

    // Return the full company object with workspace data so the frontend can update the cache
    const companyData = await this.companyRepository.findById(companyId, {
      include: { workspace: true },
    });
    return companyData;
  }

  private async upload(file: any) {
    const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const path = 'workspace/' + v4() + '.' + fileType;

    const { url } = await this.amazonStorageProvider.upload({
      file: file.buffer,
      isPublic: true,
      fileName: path,
    });

    return url;
  }
}
