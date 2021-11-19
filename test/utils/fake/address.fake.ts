import { AddressDto } from './../../../src/modules/company/dto/address.dto';

export class FakeAddress implements AddressDto {
  constructor(partial?: Partial<AddressDto>) {
    Object.assign(this, partial);
  }
  number = '10';
  cep = '12246000';
  street = 'string';
  complement = 'string';
  neighborhood = 'string';
  city = 'city';
  state = 'UF';
}
