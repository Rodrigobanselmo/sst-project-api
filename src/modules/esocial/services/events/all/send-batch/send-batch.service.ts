import { IEsocialSendBatchResponse } from './../../../../interfaces/esocial';
import { Inject, Injectable } from '@nestjs/common';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
// import { Client as SoupCLient } from 'nestjs-soap';
import { createClientAsync } from 'soap';
import { Client } from 'nestjs-soap';
import fs from 'fs';
import request from 'request';
import { SoapClientEnum } from '../../../../../../shared/constants/enum/soapClient';
import X509HttpClient from 'soap-x509-http';
import axios from 'axios';
import format from 'xml-formatter';
import https from 'https';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
const xml = `<eSocial xmlns="http://www.esocial.gov.br/schema/lote/eventos/envio/v1_1_1">
  <envioLoteEventos grupo="2">
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>17147530000160</nrInsc>
    </ideEmpregador>
    <ideTransmissor>
      <tpInsc>1</tpInsc>
      <nrInsc>171475300001601</nrInsc>
    </ideTransmissor>
    <eventos>
      <evento Id="ID1171475300001602022110815093100002">
        <eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtMonit/v_S_01_00_00">
          <evtMonit Id="ID1171475300001602022110815093100002">
            <ideEvento>
              <indRetif>1</indRetif>
              <tpAmb>2</tpAmb>
              <procEmi>1</procEmi>
              <verProc>Simple_SST_eSocial 1.0</verProc>
            </ideEvento>
            <ideEmpregador>
              <tpInsc>1</tpInsc>
              <nrInsc>17147530000160</nrInsc>
            </ideEmpregador>
            <ideVinculo>
              <cpfTrab>05519210217</cpfTrab>
              <matricula>klnoihioh</matricula>
            </ideVinculo>
            <exMedOcup>
              <tpExameOcup>0</tpExameOcup>
              <aso>
                <dtAso>2022-11-02</dtAso>
                <resAso>1</resAso>
                <medico>
                  <nmMed>Marcelo Massakazu Baba</nmMed>
                  <nrCRM>12321421</nrCRM>
                  <ufCRM>DF</ufCRM>
                </medico>
                <exame>
                  <dtExm>2022-11-01</dtExm>
                  <procRealizado>0693</procRealizado>
                </exame>
                <exame>
                  <dtExm>2022-11-02</dtExm>
                  <procRealizado>0295</procRealizado>
                </exame>
              </aso>
              <respMonit>
                <cpfResp>44965019024</cpfResp>
                <nmResp>Marcelo Massakazu Baba</nmResp>
                <nrCRM>12321421</nrCRM>
                <ufCRM>DF</ufCRM>
              </respMonit>
            </exMedOcup>
          </evtMonit>
          <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
            <SignedInfo>
              <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
              <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
              <Reference URI="">
                <Transforms>
                  <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
                  <Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
                </Transforms>
                <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                <DigestValue>av+bobqOGVoqOhuAUcW7qZqQmnmS77bQVAC9tVDDefw=</DigestValue>
              </Reference>
            </SignedInfo>
            <SignatureValue>ZB76S5TqIORTL8v2ZkNgxWZprKVL1/LjF+JMjElaOOIgO6WJiJYpYiyfzazdfuF727mwX+Ue/nu1tq9Lb0032AgeonWiQ6mbq0NeO1hWDlw8PUu8EQGJDMmZWbsTMBR41zg1W0W9hIpN4XAtbdEGfhBfkS9+FAYFIC7JbtHCQNpjjlRApxO8oJMCTP5G8r1l1OYICAO5KpFz8x8nPdCa1PuRQIQMxxLTyLXaCfxU4d++7VKJNvPhxFCQ2atcrO3BMIrwqDgtijdhNTkMrzWDpOoFTDnVXtVR9lJCBEnDRRKLQDhnvjhW4uEq27L7nvCE2S/bZcJ+AKoK6vuGDNiXbA==</SignatureValue>
            <KeyInfo>
              <X509Data>
                <X509Certificate>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</X509Certificate>
              </X509Data>
            </KeyInfo>
          </Signature>
        </eSocial>
      </evento>
    </eventos>
  </envioLoteEventos>
</eSocial>`;
// 71628843500
@Injectable()
export class SendBatchESocialService {
  constructor(
    @Inject(SoapClientEnum.PRODUCTION_RESTRICT)
    private readonly soupClient: Client,
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
  ) {}

  async execute() {
    const { company, cert } = await this.eSocialMethodsProvider.getCompany('d1309cad-19d4-4102-9bf9-231f91095c20', { cert: true, report: true });
    const xml = '<library>' + '<book Id="ID1034952680000002022100418283200001">' + '<name>Harry Potter</name>' + '</book>' + '</library>';

    const s = await this.eSocialMethodsProvider.signEvent({
      xml,
      cert,
    });

    fs.writeFileSync(
      'tmp/test-sign-no.xml',
      format(s, {
        indentation: '  ',
        filter: (node) => node.type !== 'Comment',
        collapseContent: true,
        lineSeparator: '\n',
      }),
    );

    return { s };
    const promise = new Promise((resolve) => {
      this.soupClient.ServicoEnviarLoteEventos.WsEnviarLoteEventos.EnviarLoteEventos(xml, (e, s) => {
        if (e)
          return resolve({
            status: {
              cdResposta: 500,
              descResposta: e?.message?.slice(0, 200) + '...',
            },
          });

        if (!s?.EnviarLoteEventosResult?.eSocial?.retornoEnvioLoteEventos)
          return resolve({
            status: {
              cdResposta: 500,
              descResposta: 'value of (s?.EnviarLoteEventosResult?.eSocial?.retornoEnvioLoteEventos) is undefined',
            },
          });

        resolve(s.EnviarLoteEventosResult.eSocial.retornoEnvioLoteEventos);
      });
    });

    const res = (await promise) as IEsocialSendBatchResponse;

    return;

    //     const url =
    //   options?.environment != 1
    //     ? process.env.ESOCIAL_URL_PROD_RESTRICT
    //     : process.env.ESOCIAL_URL;

    // const httpsAgent = new https.Agent({
    //   rejectUnauthorized: false, // (NOTE: this will disable client verification)
    //   pfx: fs.readFileSync('cert/cert.pfx'),
    //   passphrase: process.env.TRANSMISSION_PFX_PASSWORD,
    // });

    // const api = axios.create({
    //   httpsAgent,
    // });

    // const client = await createClientAsync(url, {
    //   request: api,
    //   escapeXML: false,
    // });

    return;
  }
}
