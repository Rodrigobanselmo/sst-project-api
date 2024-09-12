export type IAddressModel = {
  cep: string;
  number: string | null;
  street: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
}

export class AddressModel {
  cep: string;
  number: string | null;
  street: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;

  constructor(params: IAddressModel) {
    this.number = params.number;
    this.cep = params.cep;
    this.street = params.street;
    this.complement = params.complement;
    this.neighborhood = params.neighborhood;
    this.city = params.city;
    this.state = params.state;
  }

  get formattedAddress() {
    return `${this.street}, ${this.number} - ${this.neighborhood}, ${this.formattedCity}`;
  }

  get formattedCity() {
    return `${this.city || 'Cidade não informada'} - ${this.state || 'UF não informado'}`;
  }
}
