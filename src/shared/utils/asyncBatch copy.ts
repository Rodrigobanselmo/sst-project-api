import { arrayChunks } from './arrayChunks';
import { asyncEach } from './asyncEach';

export async function asyncBatch<T, S>(
  array: T[],
  perChunk: number,
  callbackFn: (value: T, index?: number) => Promise<S>,
) {
  const data = await asyncEach(arrayChunks(array, perChunk), async (chunk, index) =>
    Promise.all(chunk.map(async (dt) => callbackFn(dt, index))),
  );

  return data.reduce((acc, curr) => [...acc, ...curr], []);
}
