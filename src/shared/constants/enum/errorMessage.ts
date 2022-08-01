export enum ErrorMessageEnum {
  FILE_WRONG_TABLE_HEAD = 'Cabeçario da tabela está com valores diferente do esperado, certifique-se que você possui a versão mais atualizada da tabela',
  EMAIL_NOT_SEND = 'Erro no envio de email',
  NOT_FOUND_ON_COMPANY_TO_DELETE = 'Dado a ser deletado não foi encontrado nesta empresa',
  PRISMA_ERROR = 'Desculpe, algo de errado acontenceu, informe o suporte para mais detalhes',
}

export enum ErrorCompanyEnum {
  INVALID_CPF = 'CPF inválido',
  CREATE_HIERARCHY_WITH_PARENT = "O campo 'parentId' não pode existir para o tipo 'Directory'",
  UPDATE_HIERARCHY_WITH_PARENT = "O campo 'parentId' não pode existir para o tipo 'Directory'",
  UPSERT_HIERARCHY_WITH_PARENT = "O campo 'parentId' é obrigatório",
  UPSERT_HIERARCHY_WITH_EMPLOYEE_WITH_SUB_OFFICE = 'Não é possivel trocar de cargo empregados que estão vinculados a cargos desenvolvidos',
  UPSERT_HIERARCHY_WITH_SUB_OFFICE_OTHER_OFFICE = 'Não é possivel adicionar um empregado de outro cargo a um cargo desenvolvido',
  EVERYONE_NOT_FROM_SAME_OFFICE = 'Os empregados precisam estar no mesmo cargo',
  GHO_NOT_FOUND = 'O GHO informado não foi encontrado nesta empresa',
  ENVIRONMENT_NOT_FOUND = 'O Ambiente requisitado não foi encontrado nesta empresa',
  CHARACTERIZATION_NOT_FOUND = 'A Atividade requisitada não foi encontrado nesta empresa',
  HOMOGENEOUS_SAME_NAME = 'Já existe um grupo homogêneo com o mesmo nome',
  WORKSPACE_NOT_FOUND = 'O Estabelecimento (área de trabalho) informada não foi encontrada, verifique a sigla utilizada',
  CPF_CONFLICT = 'CPF já cadastrado',
  EMPLOYEE_NOT_FOUND = 'Empregado não encontrado',
}

export enum ErrorInvitesEnum {
  FORBIDDEN_ACCESS_USER_INVITE_LIST = 'Você não tem permissão para acessar a lista de convites de outro usuário ',
  TOKEN_EXPIRES = 'O Convite expirou',
  TOKEN_NOT_VALID_EMAIL = 'O Convite não é válido para esse email',
  FORBIDDEN_INSUFFICIENT_PERMISSIONS = 'Você não tem permissão para criar/editar um usuário com essas credênciais',
  USER_NOT_FOUND = 'Usuário não encontrado',
  USER_ALREADY_EXIST = 'Usuário já cadastrado',
  GOOGLE_USER_NOT_EXIST = 'Nenhum usuário econtrado que esteja vinculado a esta conta Google',
  AUTH_GROUP_NOT_FOUND = 'Grupo de permissões não enontrado',
  EMAIL_NOT_FOUND = 'Usuário com o :v1 não encontrado',
  TOKEN_NOT_FOUND = 'Convite não encontrado',
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
