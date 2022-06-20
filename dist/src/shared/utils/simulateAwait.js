"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateAwait = void 0;
function simulateAwait(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
exports.simulateAwait = simulateAwait;
//# sourceMappingURL=simulateAwait.js.map