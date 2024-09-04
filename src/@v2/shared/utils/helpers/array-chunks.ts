interface IChuckOptions {
  balanced: boolean;
}

export function arrayChunks<T>(array: T[], perChunk: number, options?: IChuckOptions): Array<T[]> {
  const chuckArray = array.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [] as T[];
    }

    acc[chunkIndex].push(item);

    return acc;
  }, [] as T[][]);

  if (options?.balanced) {
    const chunkLength = chuckArray.length;
    const lastChunkIndex = chunkLength - 1;
    const secondLastChunkIndex = chunkLength - 2;
    let index = secondLastChunkIndex;

    if (chuckArray[secondLastChunkIndex]) {
      while (chuckArray[lastChunkIndex].length < chuckArray[secondLastChunkIndex].length) {
        const item = chuckArray[index].pop();
        if (item) chuckArray[lastChunkIndex].push(item);

        if (chuckArray[index - 1]) index--;
        if (!chuckArray[index - 1]) index = secondLastChunkIndex;
      }
    }
  }

  return chuckArray;
}
