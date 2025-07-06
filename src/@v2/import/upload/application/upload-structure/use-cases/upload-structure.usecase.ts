import { Injectable } from '@nestjs/common';
import { IUploadStructureUseCase } from './upload-structure.types';
import { UploadStructureService } from '../../../services/upload-structure/upload-structure.service';
import { UploadStructureProduct } from '../../../products/upload-structure/upload-structure.product';

@Injectable()
export class UploadStructureUseCase {
  constructor(
    private readonly uploadStructureService: UploadStructureService,
    private readonly uploadStructureProduct: UploadStructureProduct,
  ) {}

  async execute({ buffer, ...params }: IUploadStructureUseCase.Params) {
    return this.uploadStructureService.upload({
      product: this.uploadStructureProduct,
      data: params,
      buffer,
    });
  }
}
