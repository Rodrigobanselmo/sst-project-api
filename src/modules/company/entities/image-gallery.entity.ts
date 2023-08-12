import { ImageGallery, ImagesTypeEnum } from '@prisma/client';

import { CompanyEntity } from './company.entity';

export class ImageGalleryEntity implements ImageGallery {
  id: number;
  types: ImagesTypeEnum[];
  url: string;
  companyId: string;
  name: string;
  search: string;
  company: CompanyEntity;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<ImageGalleryEntity>) {
    Object.assign(this, partial);
  }
}
