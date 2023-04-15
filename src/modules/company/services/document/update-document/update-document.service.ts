import { DocumentEntity } from './../../../entities/document.entity';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UpdateDocumentDto } from '../../../dto/document.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class UpdateDocumentService {
  constructor(private readonly documentRepository: DocumentRepository, private readonly amazonStorageProvider: AmazonStorageProvider) {}

  async execute(updateDto: UpdateDocumentDto, user: UserPayloadDto, file: Express.Multer.File) {
    const companyId = user.targetCompanyId;
    const documentFound = await this.documentRepository.findFirstNude({
      where: {
        id: updateDto.id,
        companyId,
      },
      select: { id: true, fileUrl: true },
    });

    if (!documentFound?.id) throw new BadRequestException(ErrorMessageEnum.DOCUMENT_NOT_FOUND);

    let url: string;

    if (file) {
      url = await this.upload(companyId, file, documentFound);
    }

    const document = await this.documentRepository.update({
      ...updateDto,
      companyId: user.targetCompanyId,
      fileUrl: url,
    });

    return document;
  }

  private async upload(companyId: string, file: Express.Multer.File, documentFound: DocumentEntity) {
    if (documentFound?.fileUrl) {
      const splitUrl = documentFound.fileUrl.split('.com/');

      await this.amazonStorageProvider.delete({
        fileName: splitUrl[splitUrl.length - 1],
      });
    }

    const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const path = 'documents/' + `${documentFound?.name || ''}-${v4()}` + '.' + fileType;

    const { url } = await this.amazonStorageProvider.upload({
      file: file.buffer,
      fileName: path,
      // isPublic: true,
    });

    return url;
  }
}
