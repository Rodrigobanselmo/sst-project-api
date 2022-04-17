export enum ErrorMessageEnum {
  FILE_WRONG_TABLE_HEAD = 'Cabeçario da tabela está com valores diferente do esperado, certifique-se que você possui a versão mais atualizada da tabela',
}

export enum ErrorCompanyEnum {
  CREATE_WITH_PARENT = "O campo 'parentId' não pode existir para o tipo 'Directory'",
  UPDATE_WITH_PARENT = "O campo 'parentId' não pode existir para o tipo 'Directory'",
}
