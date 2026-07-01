import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { StatusEnum } from '@prisma/client';

import { BrowseSubTypeUseCase } from './browse-sub-type.usecase';

describe('BrowseSubTypeUseCase', () => {
  let useCase: BrowseSubTypeUseCase;
  let browse: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    browse = jest.fn(() => Promise.resolve({ results: [] }));
    useCase = new BrowseSubTypeUseCase({ browse } as never);
  });

  it('6. por padrão filtra apenas ACTIVE', async () => {
    await useCase.execute({
      pagination: { page: 1, limit: 20 },
      types: ['QUI' as never],
    });

    expect(browse).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({
          status: StatusEnum.ACTIVE,
          types: ['QUI'],
        }),
      }),
    );
  });

  it('5. browse com types[]=QUI repassa filtro de tipo', async () => {
    await useCase.execute({
      pagination: { page: 1, limit: 50 },
      types: ['QUI' as never],
      search: 'solvente',
    });

    expect(browse).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: {
          types: ['QUI'],
          search: 'solvente',
          status: StatusEnum.ACTIVE,
        },
      }),
    );
  });
});
