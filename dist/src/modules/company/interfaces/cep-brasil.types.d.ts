import { UfStateEnum } from '@prisma/client';
export interface ICepBrasilResponse {
    cep: string;
    state: UfStateEnum;
    city: string;
    neighborhood: string;
    street: string;
}
