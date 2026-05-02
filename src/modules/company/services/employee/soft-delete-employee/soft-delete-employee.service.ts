import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class SoftDeleteEmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(employeeId: number, companyId: string | undefined) {
    if (!companyId) {
      throw new BadRequestException('Empresa não selecionada.');
    }

    const result = await this.employeeRepository.softDeleteById(employeeId, companyId);

    if (result.count === 0) {
      throw new NotFoundException(
        'Funcionário não encontrado, já foi removido ou não pertence a esta empresa.',
      );
    }

    return { ok: true };
  }
}
