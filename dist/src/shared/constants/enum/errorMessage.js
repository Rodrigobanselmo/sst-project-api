"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorAuthEnum = exports.ErrorDocumentEnum = exports.ErrorChecklistEnum = exports.ErrorInvitesEnum = exports.ErrorCompanyEnum = exports.ErrorMessageEnum = void 0;
var ErrorMessageEnum;
(function (ErrorMessageEnum) {
    ErrorMessageEnum["FILE_WRONG_TABLE_HEAD"] = "Cabe\u00E7ario da tabela est\u00E1 com valores diferente do esperado, certifique-se que voc\u00EA possui a vers\u00E3o mais atualizada da tabela";
    ErrorMessageEnum["NOT_FOUND_ON_COMPANY_TO_DELETE"] = "Dado a ser deletado n\u00E3o foi encontrado nesta empresa";
})(ErrorMessageEnum = exports.ErrorMessageEnum || (exports.ErrorMessageEnum = {}));
var ErrorCompanyEnum;
(function (ErrorCompanyEnum) {
    ErrorCompanyEnum["CREATE_HIERARCHY_WITH_PARENT"] = "O campo 'parentId' n\u00E3o pode existir para o tipo 'Directory'";
    ErrorCompanyEnum["UPDATE_HIERARCHY_WITH_PARENT"] = "O campo 'parentId' n\u00E3o pode existir para o tipo 'Directory'";
    ErrorCompanyEnum["UPSERT_HIERARCHY_WITH_PARENT"] = "O campo 'parentId' \u00E9 obrigat\u00F3rio";
    ErrorCompanyEnum["GHO_NOT_FOUND"] = "O GHO informado n\u00E3o foi encontrado nesta empresa";
    ErrorCompanyEnum["WORKSPACE_NOT_FOUND"] = "O Estabelecimento (\u00E1rea de trabalho) informada n\u00E3o foi encontrada, verifique a sigla utilizada";
})(ErrorCompanyEnum = exports.ErrorCompanyEnum || (exports.ErrorCompanyEnum = {}));
var ErrorInvitesEnum;
(function (ErrorInvitesEnum) {
    ErrorInvitesEnum["FORBIDDEN_ACCESS_USER_INVITE_LIST"] = "Voc\u00EA n\u00E3o tem permiss\u00E3o para acessar a lista de convites de outro usu\u00E1rio ";
    ErrorInvitesEnum["TOKEN_EXPIRES"] = "O Convite expirou";
    ErrorInvitesEnum["TOKEN_NOT_VALID_EMAIL"] = "O Convite n\u00E3o \u00E9 v\u00E1lido para esse email";
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
//# sourceMappingURL=errorMessage.js.map