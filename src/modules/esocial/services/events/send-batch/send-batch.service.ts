import { Inject, Injectable } from '@nestjs/common';
import { ESocialEventProvider } from '../../../../../shared/providers/ESocialEventProvider/implementations/ESocialEventProvider';
// import { Client as SoupCLient } from 'nestjs-soap';
import { createClient, createClientAsync, listen } from 'soap';
import fs from 'fs';
import request from 'request';
import { SoapClientEnum } from '../../../../../shared/constants/enum/soapClient';
import X509HttpClient from 'soap-x509-http';
import axios from 'axios';
import https from 'https';
const xml = `<eSocial xmlns="http://www.esocial.gov.br/schema/lote/eventos/envio/v1_1_1">                           
<envioLoteEventos grupo="2"><ideEmpregador><tpInsc>1</tpInsc><nrInsc>03495268</nrInsc></ideEmpregador><ideTransmissor><tpInsc>1</tpInsc><nrInsc>05902489000100</nrInsc></ideTransmissor><eventos><evento Id="ID1034952680000002022100418283200001"><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtMonit/v_S_01_00_00"><evtMonit Id="ID1034952680000002022100418283200001"><ideEvento><indRetif>1</indRetif><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>SMTI_eSocial 1.0</verProc></ideEvento><ideEmpregador><tpInsc>1</tpInsc><nrInsc>03495268</nrInsc></ideEmpregador><ideVinculo><cpfTrab>19239341714</cpfTrab><matricula>218</matricula></ideVinculo><exMedOcup><tpExameOcup>1</tpExameOcup><aso><dtAso>2022-05-27</dtAso><resAso>1</resAso><exame><dtExm>2022-05-27</dtExm><procRealizado>0295</procRealizado><ordExame>2</ordExame></exame><medico><nmMed>J&#xE9;ssica Marques Rodrigues</nmMed><nrCRM>1145886</nrCRM><ufCRM>RJ</ufCRM></medico></aso><respMonit><nmResp>Marcelo Massakazu Baba</nmResp><nrCRM>52.115.1</nrCRM><ufCRM>RJ</ufCRM></respMonit></exMedOcup></evtMonit><Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
  <SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
    <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
  <Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><DigestValue>FeMG0ctQg2KGuxWIfZvW7ZrrwndaB528sAlmmE/rQB4=</DigestValue></Reference></SignedInfo><SignatureValue>kWuGYw6+69DoOrlKMqh2BXPRLMd98OMBGD5u9eV5cJJvdxuiwF+wig+y3dxV8zUvQc6ap0gc+ZVrnSxB54FvgditH6p4CQWH7Oc0nMUlu0uL9MnAVoj/Mlsvo86kTxQGqi38mAKatC2rBo2/6mXeFE0/zJpBNMmvS3wzptuGcULzkr9rzPhQBJ2MGm6pHtY011RdP39n7LMZ5WeOxJhsZBQU14cgxWEIYUi1FyNo76yc3Y50Zyd/HxSYvqcrxVQyySccrPpE8humDQdEi2SYaFBoYp/kYiwb+Ml+AkhQETiUZIAOSFc0kT8MbywusxGWtyTkN21yE3F2T8w7bIhiTw==</SignatureValue>
<KeyInfo><X509Data><X509Certificate>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</X509Certificate></X509Data></KeyInfo></Signature></eSocial></evento><evento Id="ID1034952680000002022100418283200002"><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtMonit/v_S_01_00_00"><evtMonit Id="ID1034952680000002022100418283200002"><ideEvento><indRetif>1</indRetif><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>SMTI_eSocial 1.0</verProc></ideEvento><ideEmpregador><tpInsc>1</tpInsc><nrInsc>03495268</nrInsc></ideEmpregador><ideVinculo><cpfTrab>19905584706</cpfTrab><matricula>2070</matricula></ideVinculo><exMedOcup><tpExameOcup>0</tpExameOcup><aso><dtAso>2022-05-26</dtAso><resAso>1</resAso><exame><dtExm>2022-05-26</dtExm><procRealizado>0295</procRealizado><ordExame>1</ordExame></exame><medico><nmMed>Bianca Leal Perricone</nmMed><nrCRM>52573869</nrCRM><ufCRM>RJ</ufCRM></medico></aso><respMonit><nmResp>Marcelo Massakazu Baba</nmResp><nrCRM>52.115.1</nrCRM><ufCRM>RJ</ufCRM></respMonit></exMedOcup></evtMonit><Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
  <SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
    <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
  <Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><DigestValue>upO09sU9+vZM0YZhkqzmpVxuHz3JwdYAUU+0gaZMRoI=</DigestValue></Reference></SignedInfo><SignatureValue>ltLjK1XEVOU8nAahgITNJuoGq6mo+ZAk8aQNgzVwoWcT6oct9HoEBKkMfV/Iy0kWM189XW2RTIjY6jPbmkJcxVi+1awrHFEfsV9ut/Xp17PmyYCo5bgWJPvwf6wBcN5qCLs79PDspIOd6jhisOLEOJThWAG2kC6xW+9tGNNZ7Ug8tLO/dBDgmr2uTsWHKP28o79nnYDOk1AFcBxWNC6Hdzqo5hZU9tZXg0Q8eU/G3cysE2/ayCQDlxbLjnSJWuHa9Q05FAM9pz1yFVT27ovGAHPRrPfi29qDMA80NyBS0ZWr28fssnZUTYAzuE1IrsFvrhi/Afw4f4ErhNjHJgQFDw==</SignatureValue>
<KeyInfo><X509Data><X509Certificate>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</X509Certificate></X509Data></KeyInfo></Signature></eSocial></evento><evento Id="ID1034952680000002022100418283200003"><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtMonit/v_S_01_00_00"><evtMonit Id="ID1034952680000002022100418283200003"><ideEvento><indRetif>1</indRetif><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>SMTI_eSocial 1.0</verProc></ideEvento><ideEmpregador><tpInsc>1</tpInsc><nrInsc>03495268</nrInsc></ideEmpregador><ideVinculo><cpfTrab>02189110769</cpfTrab><matricula>2094</matricula></ideVinculo><exMedOcup><tpExameOcup>0</tpExameOcup><aso><dtAso>2022-07-25</dtAso><resAso>1</resAso><exame><dtExm>2022-07-25</dtExm><procRealizado>0295</procRealizado><ordExame>1</ordExame></exame><exame><dtExm>2022-07-13</dtExm><procRealizado>0693</procRealizado><ordExame>2</ordExame><indResult>1</indResult></exame><exame><dtExm>2022-07-13</dtExm><procRealizado>0536</procRealizado><ordExame>2</ordExame><indResult>1</indResult></exame><exame><dtExm>2022-07-13</dtExm><procRealizado>0530</procRealizado><ordExame>2</ordExame><indResult>1</indResult></exame><exame><dtExm>2022-07-13</dtExm><procRealizado>0658</procRealizado><ordExame>2</ordExame><indResult>1</indResult></exame><exame><dtExm>2022-07-13</dtExm><procRealizado>0296</procRealizado><ordExame>2</ordExame><indResult>1</indResult></exame><medico><nmMed>Jo&#xE3;o Toste do Couto</nmMed><nrCRM>248011</nrCRM><ufCRM>RJ</ufCRM></medico></aso><respMonit><nmResp>Marcelo Massakazu Baba</nmResp><nrCRM>52.115.1</nrCRM><ufCRM>RJ</ufCRM></respMonit></exMedOcup></evtMonit><Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
  <SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
    <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
  <Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><DigestValue>0RsP2+lk+RC11NuymrfbJG+u+DttU2C/00DKLzX0EjY=</DigestValue></Reference></SignedInfo><SignatureValue>N+CWszJzQO8phPKeZ3w0s2CtVTVFovr9cw+FRzTAB2alDWlTNfrc2zUb2xOSv0g+WW29FG96ljqdOoTBvVubqSTGcKtQqe2baVlfaZItOASqOlUWi+j+bw7Snc+ZWZz8Pa5yQ6CP3Q05u7KRbTCM4cLSTCCt4uoAIy7DquI1NNFmgACySN7nCjEKA1Aan+0yxnZhD8hznFdbom8pnbzP84EUPsYcWp93gile/hQ2O9qP7b/4M4ln7lGfWVDKS9/ovqDxuqpaBsi9YTSF9YOL2T2AOg/CghcXrkUvNp7Jc2QntmfhEz2lTSM/dDXaxXmtMPCU/ceYeeY94K9QysaUgQ==</SignatureValue>
<KeyInfo><X509Data><X509Certificate>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</X509Certificate></X509Data></KeyInfo></Signature></eSocial></evento></eventos></envioLoteEventos>
</eSocial>
`;

@Injectable()
export class SendBatchESocialService {
  constructor(
    // @Inject(SoupClientEnum.PRODUCTION) private readonly soupClient: SoupCLient,
    private readonly eSocialEventProvider: ESocialEventProvider,
  ) {}

  async execute() {
    // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    // const req = request.defaults({
    //   strictSSL: false,
    // });

    const url =
      'https://webservices.envio.esocial.gov.br/servicos/empregador/enviarloteeventos/WsEnviarLoteEventos.svc?wsdl' ||
      'https://www.dataaccess.com/webservicesserver/NumberConversion.wso?wsdl' ||
      process.env.ESOCIAL_URL_PROD_RESTRICT;
    const args = { name: 'ui' };

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // (NOTE: this will disable client verification)
      // cert: fs.readFileSync('./usercert.pem'),
      // key: fs.readFileSync('./key.pem'),
      pfx: fs.readFileSync('cert/cert.pfx'),
      passphrase: '230296',
    });

    const api = axios.create({
      httpsAgent,
      // headers: { 'Content-type': 'application/soap+xml' },
      // headers: { 'Content-type': 'text/xml' },
    });

    // try {
    //   const data = await api.post(url, xml);
    //   console.log(data.data);
    //   console.log(data.request);
    //   console.log(data.statusText);
    // } catch (err) {
    //   console.log(err.response);
    // }

    // or

    // const client = await createClientAsync(url, {
    //   request: api,
    //   // xml: xml,
    // } as any);
    // const result = client.wsdl.toXML();
    // console.log(result);

    const client = await createClientAsync(url, {
      request: api,
      escapeXML: false,
    });

    console.log(JSON.stringify(client.describe()));
    client.ServicoEnviarLoteEventos.WsEnviarLoteEventos.EnviarLoteEventos(
      xml,
      (e, s) => {
        console.log('erro', e);
        console.log(s.EnviarLoteEventosResult.eSocial.retornoEnvioLoteEventos);
      },
    );

    // console.log('ok', x);
    // .then((e) => console.log('ok', e))
    // .catch((e) => console.log('error', e));

    // const result = client.wsdl.toXML();
    // console.log(result);

    //!

    // const myX509Client = new (X509HttpClient as any)({
    //   pfx: fs.readFileSync('cert/cert.pfx'),
    //   passphrase: '230296',
    //   ca: fs.readFileSync('cert/esocial/cert.pem'),
    //   rejectUnauthorized: false,
    // });

    // console.log(fs.readFileSync('cert.pfx'))

    // const httpsAgent = new https.Agent({
    //   ca: fs.readFileSync('cert/esocial/cert.pem'),
    // });

    // createClient(
    //   url,
    //   {
    //     request: instance,
    //     // httpClient: myX509Client
    //   },
    //   function (err, client) {
    //     console.log('error', err);
    //     // console.log('[TESTE]', client);

    //     client.MyFunction(args, function (err, result) {
    //       console.log(result);
    //     });
    //     // client.setSecurity(
    //     //   new ClientSSLSecurityPFX(
    //     //     'cert.pfx', // or a buffer: [fs.readFileSync('/path/to/pfx/cert', 'utf8'),
    //     //     '230296',
    //     //     {
    //     //       /*default request options like */
    //     //       // strictSSL: true,
    //     //       // rejectUnauthorized: false,
    //     //       // hostname: 'some-hostname'
    //     //       // secureOptions: constants.SSL_OP_NO_TLSv1_2,
    //     //       // forever: true,
    //     //     },
    //     //   ),
    //     // );
    //   },
    // );

    // soap.createClient(
    //   process.env.ESOCIAL_URL_PROD_RESTRICT,
    //   // 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso?wsdl',

    //   function (err, client) {
    //     console.log(err);
    //     console.log(client);
    //     //your code
    //   },
    // );

    // this.soupClient.setSecurity(
    //   new soup.ClientSSLSecurityPFX(
    //     '/path/to/pfx/cert', // or a buffer: [fs.readFileSync('/path/to/pfx/cert', 'utf8'),
    //     'path/to/optional/passphrase',
    //     {
    //       /*default request options like */
    //       // strictSSL: true,
    //       // rejectUnauthorized: false,
    //       // hostname: 'some-hostname'
    //       // secureOptions: constants.SSL_OP_NO_TLSv1_2,
    //       // forever: true,
    //     },
    //   ),
    // );
    return;
  }
}

// import XMLHttpRequest from 'xhr2';

// function reqListener() {
//   console.log('iuhiuhui', this.responseText);
// }

// console.log('ok');
// const xhr = new XMLHttpRequest();
// xhr.addEventListener('load', reqListener);
// xhr.open(
//   'GET',
//   'https://webservices.producaorestrita.esocial.gov.br/servicos/empregador/enviarloteeventos/WsEnviarLoteEventos.svc',
// );

// xhr.onreadystatechange = function () {
//   if (xhr.readyState === 4) {
//     console.log(xhr.status);
//     console.log(xhr.responseText);
//     console.log(xhr);
//   }
// };

// xhr.send();
