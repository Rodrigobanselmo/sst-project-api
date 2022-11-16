import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ICnpjResponse } from '../../../../../modules/company/interfaces/cnpj';
import { ICnpjBrasilResponse } from '../../../../../modules/company/interfaces/cnpj-brasil.types';

@Injectable()
export class FindCnpjService {
  async execute(cnpj: string) {
    const cnpjString = cnpj.replace(/[ˆ\D ]/g, '');
    let response: AxiosResponse<ICnpjBrasilResponse, any>;
    try {
      response = await axios.get<ICnpjBrasilResponse>(`https://brasilapi.com.br/api/cnpj/v1/${cnpjString}`);
    } catch (error) {
      if (error.code === 'ERR_BAD_REQUEST') throw new BadRequestException(error.response.data.message);

      throw new InternalServerErrorException(error.response.data.message);
    }

    const result: ICnpjResponse = {
      cnpj: response.data.cnpj,
      activity_start_date: response.data.data_inicio_atividade,
      cadastral_situation: String(response.data.situacao_cadastral),
      cadastral_situation_date: response.data.data_situacao_cadastral,
      address: {
        cep: response.data.cep,
        city: response.data.municipio,
        complement: response.data.complemento,
        neighborhood: response.data.bairro,
        number: response.data.numero,
        street: response.data.logradouro,
        state: response.data.uf,
      },
      cadastral_situation_description: response.data.descricao_situacao_cadastral,
      fantasy: response.data.nome_fantasia,
      legal_nature: response.data.natureza_juridica,
      legal_nature_code: String(response.data.codigo_natureza_juridica),
      name: response.data.razao_social,
      phone: response.data.ddd_telefone_1 || response.data.ddd_telefone_2,
      type: response.data.identificador_matriz_filial == 1 ? 'MATRIZ' : 'FILIAL',
      size: response.data.porte,
      primary_activity: [
        {
          code: String(response.data.cnae_fiscal),
          name: response.data.cnae_fiscal_descricao,
        },
      ],
      secondary_activity: response.data.cnaes_secundarios.map((cnae) => ({
        code: String(cnae.codigo),
        name: cnae.descricao,
      })),
    };

    return result;
  }
}
// const { data } = await axios.get<ICnpjReceitaResponse>(
//   `https://www.receitaws.com.br/v1/cnpj/${cnpj.replace(/[ˆ\D ]/g, '')}`,
// );

// consultarCNPJ(cnpj);
