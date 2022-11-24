"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncBatch = void 0;
const arrayChunks_1 = require("./arrayChunks");
const asyncEach_1 = require("./asyncEach");
async function asyncBatch(array, perChunk, callbackFn) {
    const data = await (0, asyncEach_1.asyncEach)((0, arrayChunks_1.arrayChunks)(array, perChunk), async (chunk, index) => Promise.all(chunk.map(async (dt) => callbackFn(dt, index))));
    return data.reduce((acc, curr) => [...acc, ...curr], []);
}
exports.asyncBatch = asyncBatch;
//# sourceMappingURL=asyncBatch.js.map