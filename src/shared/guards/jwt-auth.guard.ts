import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { LocalContext } from 'src/@v2/shared/adapters/context';
import { ContextKey } from 'src/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from 'src/@v2/shared/constants/tokens';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * @deprecated - Use useFetch from v2
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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

  handleRequest(err, user) {
    if (err || !user) throw err || new UnauthorizedException()

    this.context.set(ContextKey.USER, user)

    return user
  }
}
