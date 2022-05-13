export enum ErrorMessageEnum {
  FILE_WRONG_TABLE_HEAD = 'Cabeçario da tabela está com valores diferente do esperado, certifique-se que você possui a versão mais atualizada da tabela',
  NOT_FOUND_ON_COMPANY_TO_DELETE = 'Dado a ser deletado não foi encontrado nesta empresa',
}

export enum ErrorCompanyEnum {
  CREATE_HIERARCHY_WITH_PARENT = "O campo 'parentId' não pode existir para o tipo 'Directory'",
  UPDATE_HIERARCHY_WITH_PARENT = "O campo 'parentId' não pode existir para o tipo 'Directory'",
  UPSERT_HIERARCHY_WITH_PARENT = "O campo 'parentId' é obrigatório",
  GHO_NOT_FOUND = 'O GHO informado não foi encontrado nesta empresa',
}

export enum ErrorChecklistEnum {
  EPI_NOT_FOUND = 'Epi não encontrado',
}
