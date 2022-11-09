import { getCompanyName } from './../../../utils/companyName';
import { CompanyEntity } from './../../../../modules/company/entities/company.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import fs from 'fs';
import PfxToPem from 'pfx-to-pem';
import { v4 } from 'uuid';
import { SignedXml } from 'xml-crypto';

import { CompanyRepository } from '../../../../modules/company/repositories/implementations/CompanyRepository';
import {
  dayjs,
  DayJSProvider,
} from '../../DateProvider/implementations/DayJSProvider';
import {
  ICompanyOptions,
  IConvertPfx,
  IConvertPfxReturn,
  ICreateZipFolder,
  IESocialEventProvider,
  IIdOptions,
  ISignEvent,
} from '../models/IESocialMethodProvider';
import JSZip from 'jszip';
import { Readable } from 'stream';
import format from 'xml-formatter';
class ESocialGenerateId {
  private cpfCnpj: string;
  private type: number;
  private index = 1;

  constructor(cpfCnpj: string, options: IIdOptions) {
    this.cpfCnpj = cpfCnpj;
    this.type = options?.type;
  }

  public newId() {
    const data = dayjs().format('YYYYMMDDHHmmss');
    const ID = `ID${this.type || 1}${this.cpfCnpj.padStart(14)}${data}${String(
      this.index,
    ).padStart(5, '0')}`;

    this.index++;
    return ID;
  }
}

@Injectable()
class ESocialMethodsProvider implements IESocialEventProvider {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly dayJSProvider?: DayJSProvider,
  ) {}

  public signEvent({ cert: { certificate, key }, xml, path }: ISignEvent) {
    const sig = new SignedXml();

    function MyKeyInfo() {
      this.getKeyInfo = function (key, prefix) {
        return `<X509Data><X509Certificate>${certificate
          .replace('-----BEGIN CERTIFICATE-----', '')
          .replaceAll('\n', '')
          .replace(
            '-----END CERTIFICATE-----',
            '',
          )}</X509Certificate></X509Data>`;
      };
      this.getKey = function (keyInfo) {
        return;
      };
    }

    sig.addReference(
      `//*[local-name(.)='${path}']`,
      [
        'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
        'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
      ],
      'http://www.w3.org/2001/04/xmlenc#sha256',
      '',
      '',
      '',
      true,
    );

    sig.signingKey = key;
    sig.canonicalizationAlgorithm =
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
    sig.signatureAlgorithm =
      'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    sig.keyInfoProvider = new MyKeyInfo();

    sig.computeSignature(xml, {
      // location: { reference: '/library/book/name', action: 'append' },
    });

    return sig.getSignedXml();
  }

  public generateId(cpfCnpj: string, { type, seqNum, index }: IIdOptions) {
    const data = this.dayJSProvider.dayjs().format('YYYYMMDDHHmmss');

    const IDs = (index ? [index] : Array.from({ length: seqNum || 1 })).map(
      (num) =>
        `ID${type || 1}${cpfCnpj.padStart(14)}${data}${String(num).padStart(
          5,
        )}`,
    );

    return IDs;
  }

  public classGenerateId(cpfCnpj: string, options?: IIdOptions) {
    return new ESocialGenerateId(cpfCnpj, options);
  }

  public async getCompany(companyId: string, options?: ICompanyOptions) {
    const company = await this.companyRepository.findFirstNude({
      where: { id: companyId },
      select: {
        id: true,
        esocialStart: true,
        esocialSend: true,
        cnpj: true,
        doctorResponsible: {
          include: { professional: { select: { name: true, cpf: true } } },
        },
        cert: !!options?.cert,
        ...(!!options?.report && {
          report: true,
        }),
        ...(!!options?.cert && {
          receivingServiceContracts: {
            select: {
              applyingServiceCompany: {
                select: { cert: true },
              },
            },
          },
        }),
        group: {
          select: {
            doctorResponsible: {
              include: { professional: { select: { name: true, cpf: true } } },
            },
            esocialStart: true,
            ...(!!options?.cert && {
              company: { select: { cert: true } },
            }),
            esocialSend: true,
          },
        },
      },
    });

    const cert =
      company?.cert ||
      company?.group?.cert ||
      company?.receivingServiceContracts?.[0].applyingServiceCompany?.cert;

    if (options?.cert && !cert)
      throw new BadRequestException('Certificado digital não cadastrado');

    return { cert, company };
  }

  public async createZipFolder({ company, eventsXml, type }: ICreateZipFolder) {
    const today = this.dayJSProvider.format(new Date(), 'DD-MM-YYYY');
    const fileName = `eSocial ${getCompanyName(company)} ${today} - S${type}`;
    const zip = new JSZip();
    const folder = zip.folder(fileName);

    eventsXml.forEach((event) => {
      folder.file(
        `EXAME_${event.id}.xml`,
        format(event.xml, {
          indentation: '  ',
          filter: (node) => node.type !== 'Comment',
          collapseContent: true,
          lineSeparator: '\n',
        }),
      );
    });

    const zipFile = await zip.generateAsync({ type: 'nodebuffer' });
    return { zipFile, fileName };
  }

  public async convertPfxToPem({
    file,
    password,
  }: IConvertPfx): Promise<IConvertPfxReturn> {
    const path = `tmp/${v4()}.pfx`;

    fs.writeFileSync(path, file.buffer);

    let pem: any;
    try {
      pem = await PfxToPem.toPem({
        path,
        password,
      });

      fs.unlinkSync(path);
    } catch (err) {
      fs.unlinkSync(path);

      const passError = err.message.includes('password?');
      if (passError) throw new BadRequestException('Senha informada inválida');
      const certNotFOund = err.message.includes('such file or direct');
      if (certNotFOund)
        throw new InternalServerErrorException('Certificado não encontrado');

      throw new InternalServerErrorException(
        'Não foi possivel converter o certificado',
      );
    }

    const notAfter = this.dayJSProvider.dayjs(pem?.attributes?.notAfter);
    const notBefore = this.dayJSProvider.dayjs(pem?.attributes?.notBefore);

    if (notAfter.toDate() < new Date())
      throw new BadRequestException(
        `Certificado digital da empresa vencido (${notAfter.format(
          'DD/MM/YYYY',
        )})`,
      );

    if (notBefore.toDate() > new Date())
      throw new BadRequestException(
        `Certificado digital da empresa válido a partir de ${notBefore.format(
          'DD/MM/YYYY',
        )}`,
      );

    return {
      certificate: pem.certificate,
      key: pem.key,
      notAfter: notAfter.toDate(),
      notBefore: notBefore.toDate(),
    };
  }
}

export { ESocialMethodsProvider };