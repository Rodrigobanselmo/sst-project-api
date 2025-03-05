import sizeOf from 'image-size';

export function getImageSize(buffer: Buffer) {
  const uint8Array = new Uint8Array(buffer);

  const dimensions = sizeOf(uint8Array);

  const isVertical = dimensions.width < dimensions.height;

  return { ...dimensions, isVertical };
}
