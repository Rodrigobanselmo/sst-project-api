import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk';

let timeToWait = new Date();
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'development') {
      if (req.method === 'OPTIONS') {
        if (next) {
          next();
        }
        return;
      }

      const shortPath = (req?.url as string)
        .split('?')[0]
        .split('/')
        .map((path) => (path.split('-').length == 5 ? path.split('-')[0] : path))
        .join('/');

      const queryParams = ((req?.url as string).split('?')[1] || '')
        .split('&')
        .map((path) => (path.split('-').length == 5 ? path.split('-')[0] : path))
        .join('&');

      const oldSend = res.send;

      res.send = (body) => {
        if (new Date() > timeToWait) {
          console.info(chalk.white(`- `));
          console.info(chalk.white(`- `));
          console.info(chalk.white(`- `));
          console.info(chalk.white(`- `));
          console.info(chalk.white(`- `));
          console.info(chalk.white(`- `));
          console.info(chalk.white(`- `));
          console.info(chalk.white(`- `));
          console.info(chalk.white(`- `));
          console.info(chalk.white(`- `));
          timeToWait = new Date(new Date().getTime() + 10000);
        }
        console.info(
          (req.method === 'GET' ? chalk.cyan : chalk.red)(`[${req.method}]: `) +
            chalk.blue(`${shortPath}`) +
            chalk.gray(`?${queryParams}`),
        );
        console.info(
          chalk.gray(`Response status: `) + chalk[res.statusCode < 400 ? 'greenBright' : 'redBright'](res.statusCode),
        );
        if (req.method !== 'GET') console.info(chalk.gray(`body: `) + chalk.yellow(JSON.stringify(req.body, null, 2)));
        if (body && body?.slice) console.info(chalk.gray(`Response body: `) + chalk.gray(body.slice(0, 500)));

        console.info(chalk.white(`- - - - - - - - - `));
        console.info(chalk.white(`- - - - - - - - - `));
        return oldSend.call(res, body);
      };
    }

    if (next) {
      next();
    }
  }
}
