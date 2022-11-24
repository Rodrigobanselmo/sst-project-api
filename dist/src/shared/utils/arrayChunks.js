"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayChunks = void 0;
function arrayChunks(array, perChunk, options) {
    const chuckArray = array.reduce((acc, item, index) => {
        const chunkIndex = Math.floor(index / perChunk);
        if (!acc[chunkIndex]) {
            acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(item);
        return acc;
    }, []);
    if (options === null || options === void 0 ? void 0 : options.balanced) {
        const chunkLength = chuckArray.length;
        const lastChunkIndex = chunkLength - 1;
        const secondLastChunkIndex = chunkLength - 2;
        let index = secondLastChunkIndex;
        if (chuckArray[secondLastChunkIndex]) {
            while (chuckArray[lastChunkIndex].length < chuckArray[secondLastChunkIndex].length) {
                const item = chuckArray[index].pop();
                chuckArray[lastChunkIndex].push(item);
                if (chuckArray[index - 1])
                    index--;
                if (!chuckArray[index - 1])
                    index = secondLastChunkIndex;
            }
        }
    }
    return chuckArray;
}
exports.arrayChunks = arrayChunks;
//# sourceMappingURL=arrayChunks.js.map