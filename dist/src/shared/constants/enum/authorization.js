"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionEnum = exports.RoleEnum = void 0;
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["MASTER"] = "master";
    RoleEnum["USER"] = "user";
    RoleEnum["ADMIN"] = "admin";
})(RoleEnum = exports.RoleEnum || (exports.RoleEnum = {}));
var PermissionEnum;
(function (PermissionEnum) {
    PermissionEnum["MASTER"] = "master";
    PermissionEnum["USER"] = "1";
    PermissionEnum["INVITE_USER"] = "1.1";
    PermissionEnum["CREATE_COMPANY"] = "2";
    PermissionEnum["CREATE_RISK"] = "3";
})(PermissionEnum = exports.PermissionEnum || (exports.PermissionEnum = {}));
//# sourceMappingURL=authorization.js.map