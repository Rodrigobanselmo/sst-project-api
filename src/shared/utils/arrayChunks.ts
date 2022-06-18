/* eslint-disable @typescript-eslint/no-unused-vars */
interface IChuckOptions {
  balanced: boolean;
}

export function arrayChunks<T>(
  array: T[],
  perChunk: number,
  options?: IChuckOptions,
): Array<T[]> {
  const chuckArray = array.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []; // start a new chunk
    }

    acc[chunkIndex].push(item);

    return acc;
  }, []);

  if (options?.balanced) {
    const chunkLength = chuckArray.length;
    const lastChunkIndex = chunkLength - 1;
    const secondLastChunkIndex = chunkLength - 2;
    let index = secondLastChunkIndex;

    if (chuckArray[secondLastChunkIndex]) {
      while (
        chuckArray[lastChunkIndex].length <
        chuckArray[secondLastChunkIndex].length
      ) {
        const item = chuckArray[index].pop();
        chuckArray[lastChunkIndex].push(item);
        index--;
      }
    }
  }

  return chuckArray;
}
