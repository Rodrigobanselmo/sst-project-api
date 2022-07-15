export enum ErrorMessageEnum {
  FILE_WRONG_TABLE_HEAD = 'Cabeçario da tabela está com valores diferente do esperado, certifique-se que você possui a versão mais atualizada da tabela',
  NOT_FOUND_ON_COMPANY_TO_DELETE = 'Dado a ser deletado não foi encontrado nesta empresa',
}

export enum ErrorCompanyEnum {
  INVALID_CPF = 'CPF inválido',
  CREATE_HIERARCHY_WITH_PARENT = "O campo 'parentId' não pode existir para o tipo 'Directory'",
  UPDATE_HIERARCHY_WITH_PARENT = "O campo 'parentId' não pode existir para o tipo 'Directory'",
  UPSERT_HIERARCHY_WITH_PARENT = "O campo 'parentId' é obrigatório",
  GHO_NOT_FOUND = 'O GHO informado não foi encontrado nesta empresa',
  ENVIRONMENT_NOT_FOUND = 'O Ambiente requisitado não foi encontrado nesta empresa',
  CHARACTERIZATION_NOT_FOUND = 'A Atividade requisitada não foi encontrado nesta empresa',
  HOMOGENEOUS_SAME_NAME = 'Já existe um grupo homogêneo com o mesmo nome',
  WORKSPACE_NOT_FOUND = 'O Estabelecimento (área de trabalho) informada não foi encontrada, verifique a sigla utilizada',
  CPF_CONFLICT = 'CPF já cadastrado',
}

export enum ErrorInvitesEnum {
  FORBIDDEN_ACCESS_USER_INVITE_LIST = 'Você não tem permissão para acessar a lista de convites de outro usuário ',
  TOKEN_EXPIRES = 'O Convite expirou',
  TOKEN_NOT_VALID_EMAIL = 'O Convite não é válido para esse email',
  FORBIDDEN_INSUFFICIENT_PERMISSIONS = 'Você não tem permissão para criar um usuário com essas credênciais',
  USER_ALREADY_EXIST = 'Usuário já cadastrado',
}

export enum ErrorChecklistEnum {
  EPI_NOT_FOUND = 'Epi não encontrado',
}

export enum ErrorDocumentEnum {
  NOT_FOUND = 'Documento não encontrado',
}

export enum ErrorAuthEnum {
  USER_ALREADY_EXIST = 'Usuário já cadastrado',
}

export enum ErrorFilesEnum {
  WRONG_TABLE_SHEET = 'A tabela que está enviando possui um nome de planilha diferente do experado: enviado: ??FOUND??, esperado: ??EXPECTED??',
  WRONG_TABLE_VERSION = 'A tabela que está enviando possui uma versão diferente, verifique se você possui a versão mais atualizada',
}
