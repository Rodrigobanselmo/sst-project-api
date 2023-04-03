import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk';

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

      console.info((req.method === 'GET' ? chalk.cyan : chalk.red)(`[${req.method}]: `) + chalk.blue(`${shortPath}`) + chalk.gray(`?${queryParams}`));
      if (req.method !== 'GET') console.info(chalk.gray(`body: `) + chalk.yellow(JSON.stringify(req.body, null, 2)));
    }

    if (next) {
      next();
    }
  }
}
