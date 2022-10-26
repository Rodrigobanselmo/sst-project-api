import { Inject, Injectable } from '@nestjs/common';
import { ESocialEventProvider } from '../../../../../shared/providers/ESocialEventProvider/implementations/ESocialEventProvider';
import { Client as SoupCLient } from 'nestjs-soap';
import soup from 'soap';
import { SoupClientEnum } from '../../../../../shared/constants/enum/soupClient';

@Injectable()
export class SendBatchESocialService {
  constructor(
    @Inject(SoupClientEnum.PRODUCTION) private readonly soupClient: SoupCLient,
    private readonly eSocialEventProvider: ESocialEventProvider,
  ) {}

  async execute() {
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
