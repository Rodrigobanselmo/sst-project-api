import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ICepResponse } from '../../../../../modules/company/interfaces/cep.types';
import { ICepBrasilResponse } from '../../../../../modules/company/interfaces/cep-brasil.types';

@Injectable()
export class FindCepService {
  async execute(cep: string) {
    const cepString = cep.replace(/[ˆ\D ]/g, '');
    let response: AxiosResponse<ICepBrasilResponse, any>;
    try {
      response = await axios.get<ICepBrasilResponse>(`https://brasilapi.com.br/api/cep/v1/${cepString}`);
    } catch (error) {
      if (error.code === 'ERR_BAD_REQUEST') throw new BadRequestException(error.response.data.message);
      throw new InternalServerErrorException(error.response.data.message);
    }

    const result: ICepResponse = {
      cep: response.data.cep,
      neighborhood: response.data.neighborhood,
      city: response.data.city,
      state: response.data.state,
      street: response.data.street,
    };

    return result;
  }
}
