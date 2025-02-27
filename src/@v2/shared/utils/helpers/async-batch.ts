import { arrayChunks } from './array-chunks';
import { asyncEach } from './async-each';

type AsyncBatchProps<T, S> = {
  items: T[];
  batchSize: number;
  callback: (value: T, batchIndex?: number, chunkIndex?: number) => Promise<S>;
};

export async function asyncBatch<T, S>({ items, callback, batchSize }: AsyncBatchProps<T, S>) {
  const data = await asyncEach(arrayChunks(items, batchSize), async (chunk, batchIndex) => Promise.all(chunk.map(async (dt, chunkIndex) => callback(dt, batchIndex, chunkIndex))));

  return data.reduce((acc, curr) => [...(acc || []), ...(curr || [])], []);
}
