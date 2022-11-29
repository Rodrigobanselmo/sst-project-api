import { FindCatDto } from '../../../dto/cat.dto';
import { CatRepository } from '../../../repositories/implementations/CatRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindCatsService {
  constructor(private readonly catRepository: CatRepository) {}

  async execute({ skip, take, ...query }: FindCatDto, user: UserPayloadDto) {
    const cats = await this.catRepository.find({ companyId: user.targetCompanyId, ...query }, { skip, take });

    return cats;
  }
}
