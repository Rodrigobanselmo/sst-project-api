import { UfStateEnum } from '@prisma/client';
export interface ICepResponse {
    cep: string;
    state: UfStateEnum;
    city: string;
    neighborhood: string;
    street: string;
}
