
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AmazonLoggerProvider } from '../providers/LoggerProvider/implementations/AmazonStorage/AmazonLoggerProvider';
import { HashProvider } from '../providers/HashProvider/implementations/HashProvider';
import { hashSensitiveData } from '../utils/hashSensitiveData';
// import geoip from 'geoip-lite';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new AmazonLoggerProvider();
  private hashProvider = new HashProvider();

  use(req: Request, res: Response, next: NextFunction) {
    const rawResponse = res.write;
    const rawResponseEnd = res.end;
    const chunkBuffers = [];

    const ip2 = req.headers['x-forwarded-for'];
    const ip3 = req.socket.remoteAddress;
    const ip4 = req.connection.remoteAddress;
    // const userAgent = (req as any).useragent.source;
    // const location = geoip.lookup(ip);

    res.write = (...chunks) => {
      const resArgs = [];
      for (let i = 0; i < chunks.length; i++) {
        resArgs[i] = chunks[i];
        if (!resArgs[i]) {
          res.once('drain', res.write);
          i--;
        }
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      return rawResponse.apply(res, resArgs);
    };

    res.end = (...chunk) => {
      const resArgs = [];
      for (let i = 0; i < chunk.length; i++) {
        resArgs[i] = chunk[i];
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }

      const isResponseFile = !!res.get('Content-Disposition');
      const body = Buffer.concat(chunkBuffers).toString('utf8');

      const { method, originalUrl, ip, headers, body: bodyReq } = req;
      const { statusCode } = res;
      const user = req.user as any;

      if (statusCode != 304) {
        this.logger.logRequest({
          status: statusCode,
          method,
          userId: user?.userId,
          originalUrl,
          userCompanyId: user?.companyId,
          targetCompanyId: user?.targetCompanyId,
          ip,
          ip2,
          ip3,
          ip4,
          headers: JSON.stringify(headers),
          requestBody: JSON.stringify(hashSensitiveData(bodyReq)),
          responseBody: isResponseFile ? 'binary file' : (body),
        });
      }

      rawResponseEnd.apply(res, resArgs);
    };

    if (next) {
      next();
    }
  }
}


// import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { AmazonLoggerProvider } from '../providers/LoggerProvider/implementations/AmazonStorage/AmazonLoggerProvider';

// @Injectable()
// export class HttpLoggerMiddleware implements NestMiddleware {
//   private logger = new AmazonLoggerProvider();

//   use(req: Request, res: Response<any, Record<string, any>>, next: NextFunction) {
//     const originalSend = res.send;
//     const logger = this.logger;

//     (res as any).send = function (body: any) {
//       const { method, originalUrl, ip, headers, body: bodyReq } = this.req;
//       const { statusMessage, statusCode } = res;
//       const user = this.req.user as any;

//       console.log('bodyReq', originalUrl, bodyReq);
//       logger.logRequest({
//         status: statusCode,
//         method,
//         userId: user?.userId,
//         userCompanyId: user?.companyId,
//         target: user?.targetCompanyId,
//         originalUrl,
//         statusMessage,
//         ip,
//         headers: JSON.stringify(headers),
//         user: JSON.stringify(user),
//         requestBody: JSON.stringify(bodyReq),
//         responseBody: body,
//       });

//       originalSend.call(this, body);
//     };

//     next();
//   }
// }