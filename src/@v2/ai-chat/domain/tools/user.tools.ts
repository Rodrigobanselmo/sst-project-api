import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { withErrorHandling } from './tool-error-handler';
import type { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';

export function createUserTools(deps: { usersRepository: UsersRepository; companyId: string }) {
  const { usersRepository, companyId } = deps;

  const listUsersTool = tool(
    async () => {
      const users = await usersRepository.findAllByCompany(companyId);
      const simplified = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
      }));
      return JSON.stringify(simplified, null, 2);
    },
    {
      name: 'listar_usuarios',
      description:
        'Lista todos os usuarios da empresa atual. Retorna um array com id, nome e email de cada usuario.',
      schema: z.object({
        _actionDescription: z
          .string()
          .describe(
            'Escreva uma breve descricao do que voce esta fazendo. DEVE ser no MESMO IDIOMA que o usuario esta usando.',
          ),
      }),
    },
  );

  return [listUsersTool].map((t) => withErrorHandling(t));
}
