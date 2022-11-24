"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionControlHeader = exports.VersionControlColumnEnum = void 0;
var VersionControlColumnEnum;
(function (VersionControlColumnEnum) {
    VersionControlColumnEnum[VersionControlColumnEnum["INDEX"] = 0] = "INDEX";
    VersionControlColumnEnum[VersionControlColumnEnum["DATE"] = 1] = "DATE";
    VersionControlColumnEnum[VersionControlColumnEnum["DESCRIPTION"] = 2] = "DESCRIPTION";
    VersionControlColumnEnum[VersionControlColumnEnum["REVISION_BY"] = 3] = "REVISION_BY";
    VersionControlColumnEnum[VersionControlColumnEnum["APPROVE_BY"] = 4] = "APPROVE_BY";
    VersionControlColumnEnum[VersionControlColumnEnum["SIGNATURE"] = 5] = "SIGNATURE";
})(VersionControlColumnEnum = exports.VersionControlColumnEnum || (exports.VersionControlColumnEnum = {}));
const NewVersionControlHeader = () => {
    const header = [];
    header[VersionControlColumnEnum.INDEX] = { text: 'N°', size: 1 };
    header[VersionControlColumnEnum.DATE] = { text: 'Data', size: 3 };
    header[VersionControlColumnEnum.DESCRIPTION] = {
        text: 'Histórico das Alterações',
        size: 15,
    };
    header[VersionControlColumnEnum.REVISION_BY] = {
        text: 'Revisado por:',
        size: 5,
    };
    header[VersionControlColumnEnum.APPROVE_BY] = {
        text: 'Aprovado por:',
        size: 6,
    };
    header[VersionControlColumnEnum.SIGNATURE] = {
        text: 'Assinaturas:',
        size: 5,
    };
    return header;
};
exports.versionControlHeader = NewVersionControlHeader();
//# sourceMappingURL=versionControl.constant.js.map