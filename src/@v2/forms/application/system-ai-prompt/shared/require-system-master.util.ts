import { ForbiddenException } from '@nestjs/common';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';

export const requireSystemMaster = (context: LocalContext): UserContext => {
  const user = context.get<UserContext>(ContextKey.USER);

  if (!user.isAdmin) {
    throw new ForbiddenException('Apenas usuários master do sistema podem executar esta ação.');
  }

  return user;
};
