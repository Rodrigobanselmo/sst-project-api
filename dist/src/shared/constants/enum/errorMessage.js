"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFilesEnum = exports.ErrorAuthEnum = exports.ErrorDocumentEnum = exports.ErrorChecklistEnum = exports.ErrorInvitesEnum = exports.ErrorCompanyEnum = exports.ErrorMessageEnum = void 0;
var ErrorMessageEnum;
(function (ErrorMessageEnum) {
    ErrorMessageEnum["FILE_WRONG_TABLE_HEAD"] = "Cabe\u00E7ario da tabela est\u00E1 com valores diferente do esperado, certifique-se que voc\u00EA possui a vers\u00E3o mais atualizada da tabela";
    ErrorMessageEnum["EMAIL_NOT_SEND"] = "Erro no envio de email";
    ErrorMessageEnum["NOT_FOUND_ON_COMPANY_TO_DELETE"] = "Dado a ser deletado n\u00E3o foi encontrado nesta empresa";
    ErrorMessageEnum["PRISMA_ERROR"] = "Desculpe, algo de errado acontenceu, informe o suporte para mais detalhes";
    ErrorMessageEnum["FORBIDDEN_ACCESS"] = "Voc\u00EA n\u00E3o tem permiss\u00E3o para realizar essa esta a\u00E7\u00E3o";
    ErrorMessageEnum["PROFESSIONAL_NOT_FOUND"] = "Profissional n\u00E3o encontrado ou sem premiss\u00F5es de acesso";
    ErrorMessageEnum["CONTACT_NOT_FOUND"] = "Contato n\u00E3o encontrado ou sem premiss\u00F5es de acesso";
    ErrorMessageEnum["CONTACT_IS_PRINCIPAL"] = "Voc\u00EA n\u00E3o pode deletar o contato principal";
    ErrorMessageEnum["DOCUMENT_NOT_FOUND"] = "Documento n\u00E3o encontrado ou sem premiss\u00F5es de acesso";
    ErrorMessageEnum["DOCUMENT_IS_PRINCIPAL"] = "Voc\u00EA n\u00E3o pode deletar o Documento principal";
    ErrorMessageEnum["WRONG_EMAIL_PASS"] = "Email ou senha incorreto";
    ErrorMessageEnum["CLINIC_EXAM_ALREADY_EXIST"] = "Exame j\u00E1 cadastrado para est\u00E1 cl\u00EDnica";
    ErrorMessageEnum["EMPLOYEE_NOT_FOUND"] = "Empregado n\u00E3o encontrado para esta empresa";
    ErrorMessageEnum["EMPLOYEE_FORBIDDEN_ADM_TWICE"] = "Funcion\u00E1rio j\u00E1 possui uma lota\u00E7\u00E3o ativa";
    ErrorMessageEnum["EMPLOYEE_MISSING_HIERARCHY"] = "\u00C9 necessario informar o cargo do funcion\u00E1rio";
    ErrorMessageEnum["EMPLOYEE_NOT_IN_HIERARCHY"] = "Funcion\u00E1rio sem v\u00EDnculo empregat\u00EDcio para esse tipo de lota\u00E7\u00E3o";
    ErrorMessageEnum["EMPLOYEE_BLOCK_HISTORY"] = "hist\u00F3rico bagun\u00E7ado, verifique se sua a\u00E7\u00E3o \u00E9 v\u00E1lida";
    ErrorMessageEnum["EMPLOYEE_HISTORY_NOT_FOUND"] = "hist\u00F3rico de exame n\u00E3o encontrado";
    ErrorMessageEnum["EMPLOYEE_HISTORY_FILE_NOT_UPLOADED"] = "n\u00E3o foi possivel fazer upload do arquivo";
    ErrorMessageEnum["PROTOCOL_NOT_FOUND"] = "Protocolo n\u00E3o encontrado ou sem premiss\u00F5es de acesso";
})(ErrorMessageEnum = exports.ErrorMessageEnum || (exports.ErrorMessageEnum = {}));
var ErrorCompanyEnum;
(function (ErrorCompanyEnum) {
    ErrorCompanyEnum["INVALID_CPF"] = "CPF inv\u00E1lido";
    ErrorCompanyEnum["CREATE_HIERARCHY_WITH_PARENT"] = "O campo 'parentId' n\u00E3o pode existir para o tipo 'Directory'";
    ErrorCompanyEnum["UPDATE_HIERARCHY_WITH_PARENT"] = "O campo 'parentId' n\u00E3o pode existir para o tipo 'Directory'";
    ErrorCompanyEnum["UPSERT_HIERARCHY_WITH_PARENT"] = "O campo 'parentId' \u00E9 obrigat\u00F3rio";
    ErrorCompanyEnum["UPSERT_HIERARCHY_WITH_EMPLOYEE_WITH_SUB_OFFICE"] = "N\u00E3o \u00E9 possivel trocar de cargo empregados que est\u00E3o vinculados a cargos desenvolvidos";
    ErrorCompanyEnum["UPSERT_HIERARCHY_WITH_SUB_OFFICE_OTHER_OFFICE"] = "N\u00E3o \u00E9 possivel adicionar um empregado de outro cargo a um cargo desenvolvido";
    ErrorCompanyEnum["EVERYONE_NOT_FROM_SAME_OFFICE"] = "Os empregados precisam estar no mesmo cargo";
    ErrorCompanyEnum["GHO_NOT_FOUND"] = "O GHO informado n\u00E3o foi encontrado nesta empresa";
    ErrorCompanyEnum["ENVIRONMENT_NOT_FOUND"] = "O Ambiente requisitado n\u00E3o foi encontrado nesta empresa";
    ErrorCompanyEnum["CHARACTERIZATION_NOT_FOUND"] = "A Atividade requisitada n\u00E3o foi encontrado nesta empresa";
    ErrorCompanyEnum["HOMOGENEOUS_SAME_NAME"] = "J\u00E1 existe um grupo homog\u00EAneo com o mesmo nome";
    ErrorCompanyEnum["WORKSPACE_NOT_FOUND"] = "O Estabelecimento (\u00E1rea de trabalho) informada n\u00E3o foi encontrada, verifique a sigla utilizada";
    ErrorCompanyEnum["CPF_CONFLICT"] = "CPF j\u00E1 cadastrado";
    ErrorCompanyEnum["EMPLOYEE_NOT_FOUND"] = "Empregado n\u00E3o encontrado";
})(ErrorCompanyEnum = exports.ErrorCompanyEnum || (exports.ErrorCompanyEnum = {}));
var ErrorInvitesEnum;
(function (ErrorInvitesEnum) {
    ErrorInvitesEnum["FORBIDDEN_ACCESS_USER_INVITE_LIST"] = "Voc\u00EA n\u00E3o tem permiss\u00E3o para acessar a lista de convites de outro usu\u00E1rio ";
    ErrorInvitesEnum["TOKEN_EXPIRES"] = "O Convite expirou";
    ErrorInvitesEnum["TOKEN_NOT_VALID_EMAIL"] = "O Convite n\u00E3o \u00E9 v\u00E1lido para esse email";
    ErrorInvitesEnum["FORBIDDEN_INSUFFICIENT_PERMISSIONS"] = "Voc\u00EA n\u00E3o tem permiss\u00E3o para criar/editar um usu\u00E1rio com essas cred\u00EAnciais";
    ErrorInvitesEnum["USER_NOT_FOUND"] = "Usu\u00E1rio n\u00E3o encontrado";
    ErrorInvitesEnum["USER_ALREADY_EXIST"] = "Usu\u00E1rio j\u00E1 cadastrado";
    ErrorInvitesEnum["GOOGLE_USER_NOT_EXIST"] = "Nenhum usu\u00E1rio econtrado que esteja vinculado a esta conta Google";
    ErrorInvitesEnum["AUTH_GROUP_NOT_FOUND"] = "Grupo de permiss\u00F5es n\u00E3o enontrado";
    ErrorInvitesEnum["EMAIL_NOT_FOUND"] = "Usu\u00E1rio com o :v1 n\u00E3o encontrado";
    ErrorInvitesEnum["TOKEN_NOT_FOUND"] = "Convite n\u00E3o encontrado";
})(ErrorInvitesEnum = exports.ErrorInvitesEnum || (exports.ErrorInvitesEnum = {}));
var ErrorChecklistEnum;
(function (ErrorChecklistEnum) {
    ErrorChecklistEnum["EPI_NOT_FOUND"] = "Epi n\u00E3o encontrado";
})(ErrorChecklistEnum = exports.ErrorChecklistEnum || (exports.ErrorChecklistEnum = {}));
var ErrorDocumentEnum;
(function (ErrorDocumentEnum) {
    ErrorDocumentEnum["NOT_FOUND"] = "Documento n\u00E3o encontrado";
})(ErrorDocumentEnum = exports.ErrorDocumentEnum || (exports.ErrorDocumentEnum = {}));
var ErrorAuthEnum;
(function (ErrorAuthEnum) {
    ErrorAuthEnum["USER_ALREADY_EXIST"] = "Usu\u00E1rio j\u00E1 cadastrado";
})(ErrorAuthEnum = exports.ErrorAuthEnum || (exports.ErrorAuthEnum = {}));
var ErrorFilesEnum;
(function (ErrorFilesEnum) {
    ErrorFilesEnum["WRONG_TABLE_SHEET"] = "A tabela que est\u00E1 enviando possui um nome de planilha diferente do experado: enviado: ??FOUND??, esperado: ??EXPECTED??";
    ErrorFilesEnum["WRONG_TABLE_VERSION"] = "A tabela que est\u00E1 enviando possui uma vers\u00E3o diferente, verifique se voc\u00EA possui a vers\u00E3o mais atualizada";
})(ErrorFilesEnum = exports.ErrorFilesEnum || (exports.ErrorFilesEnum = {}));
//# sourceMappingURL=errorMessage.js.map