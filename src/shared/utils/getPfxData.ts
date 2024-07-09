import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { unlinkSync, writeFileSync } from 'fs';
import PfxToPem from 'pfx-to-pem';
import { v4 } from 'uuid';
import { DayJSProvider } from '../providers/DateProvider/implementations/DayJSProvider';

interface CertificateAttributes {
  publicModulus: string;
  publicExponent: string;
  subject: {
    commonName: string;
    countryName: string;
    localityName: string;
    organizationName: string;
    organizationalUnitName: string;
    stateOrProvinceName: string;
  };
  issuer: {
    commonName: string;
    countryName: string;
    organizationName: string;
    organizationalUnitName: string;
  };
  serial: string;
  notBefore: string;
  notAfter: string;
  altNames: string[];
  ocspList: string[];
}

interface CertificateData {
  certificate: string;
  key: string;
  attributes: CertificateAttributes;
}

export const getPfxData = async ({ buffer, password }: { buffer: Buffer; password: string }) => {
  const path = `tmp/${v4()}.pfx`;

  writeFileSync(path, buffer);

  let pem: CertificateData;
  try {
    pem = await PfxToPem.toPem({
      path,
      password,
    });

    unlinkSync(path);
  } catch (err) {
    unlinkSync(path);

    const passError = err.message.includes('password?');
    if (passError) throw new BadRequestException('Senha informada inválida');
    const certNotFOund = err.message.includes('such file or direct');
    if (certNotFOund) throw new InternalServerErrorException('Certificado não encontrado');

    throw new InternalServerErrorException('Não foi possivel converter o certificado');
  }

  const dayjs = new DayJSProvider();
  const notAfter = dayjs.dayjs(pem?.attributes?.notAfter);
  const notBefore = dayjs.dayjs(pem?.attributes?.notBefore);

  if (notAfter.toDate() < new Date())
    throw new BadRequestException(`Certificado digital da empresa vencido (${notAfter.format('DD/MM/YYYY')})`);

  if (notBefore.toDate() > new Date())
    throw new BadRequestException(
      `Certificado digital da empresa válido a partir de ${notBefore.format('DD/MM/YYYY')}`,
    );

  return {
    pem,
    notAfter: notAfter.toDate(),
    notBefore: notBefore.toDate(),
  };
};
