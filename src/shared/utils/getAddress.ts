import { AddressCompanyEntity } from './../../modules/company/entities/address-company.entity';
import { formatCEP } from '@brazilian-utils/brazilian-utils';
import { AddressEntity } from '../../modules/company/entities/address.entity';
import { ContactEntity } from '../../modules/company/entities/contact.entity';

export const getAddressMain = (address?: AddressEntity | AddressCompanyEntity) => {
  if (!address) return '';
  return `${address.street}, ${address.number} - ${address.neighborhood} ${address.complement}`;
};

export const getAddressCity = (address?: AddressEntity | AddressCompanyEntity) => {
  if (!address) return '';
  return `${address.city} - ${address.state}, ${formatCEP(address.cep)}`;
};

export const getContact = (contact?: ContactEntity) => {
  if (!contact) return '';
  return `Tel: ${contact.phone}  ${contact.phone_1 ? `/ Email: ${contact.email}` : ''}`;
};
