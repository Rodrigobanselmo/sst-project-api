import { IS_PUBLIC_KEY } from '@/shared/decorators/public.decorator';
import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { LocalContext } from '../adapters/context';
import { SharedTokens } from '../constants/tokens';
import { ContextKey } from '../adapters/context/types/enum/context-key.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-v2') {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext, private reflector: Reflector) {
    super();
  }


  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) throw err || new UnauthorizedException()

    this.context.set(ContextKey.USER, user)

    return user
  }
}
