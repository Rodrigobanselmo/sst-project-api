import { Injectable } from '@nestjs/common';
import { ESocial27TableRepository } from '../../repositories/implementations/ESocial27TableRepository';

@Injectable()
export class FindAllTable27Service {
  constructor(private readonly eSocial27TableRepository: ESocial27TableRepository) {}

  async execute() {
    return await this.eSocial27TableRepository.findAll();
  }
}
