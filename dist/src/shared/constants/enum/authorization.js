"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionEnum = exports.RoleEnum = void 0;
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["MASTER"] = "master";
    RoleEnum["ADMIN"] = "admin";
    RoleEnum["USER"] = "user";
    RoleEnum["MANAGEMENT"] = "management";
    RoleEnum["CONTRACTS"] = "contracts";
    RoleEnum["DATABASE"] = "database";
    RoleEnum["DOCS"] = "docs";
    RoleEnum["RISK"] = "risk";
    RoleEnum["CHECKLIST"] = "checklist";
})(RoleEnum = exports.RoleEnum || (exports.RoleEnum = {}));
var PermissionEnum;
(function (PermissionEnum) {
    PermissionEnum["MASTER"] = "master";
    PermissionEnum["COMPANY"] = "2";
    PermissionEnum["CREATE_COMPANY"] = "2.1";
    PermissionEnum["CONTRACT"] = "3";
    PermissionEnum["EMPLOYEE"] = "4";
    PermissionEnum["HOMO_GROUP"] = "5";
    PermissionEnum["USER"] = "1";
    PermissionEnum["INVITE_USER"] = "1.1";
    PermissionEnum["CREATE_RISK"] = "10";
})(PermissionEnum = exports.PermissionEnum || (exports.PermissionEnum = {}));
//# sourceMappingURL=authorization.js.map