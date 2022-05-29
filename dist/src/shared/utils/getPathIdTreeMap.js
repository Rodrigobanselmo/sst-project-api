"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathIdTreeMap = void 0;
const getPathIdTreeMap = (id, nodes) => {
    const path = [];
    const loop = (id) => {
        const node = nodes[id];
        if (node) {
            path.push(node.id);
            if (node.parentId) {
                loop(node.parentId);
            }
        }
    };
    loop(id);
    return path.reverse();
};
exports.getPathIdTreeMap = getPathIdTreeMap;
//# sourceMappingURL=getPathIdTreeMap.js.map