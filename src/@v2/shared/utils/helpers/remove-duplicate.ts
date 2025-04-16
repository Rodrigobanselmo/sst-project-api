interface IDuplicateOptions {
  idPath?: string;
}

function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export function removeDuplicate<T>(array: T[], options?: IDuplicateOptions): T[] {
  if (array.length === 0) return array;

  const isPrimitive = typeof array[0] === 'string' || typeof array[0] === 'number';
  if (isPrimitive) {
    return array.filter((item, index, self) => index === self.findIndex((t) => t === item));
  }

  if (options?.idPath) {
    const seen = new Set();
    return array.filter((item) => {
      const id = getValueByPath(item, options.idPath!);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  return array;
}
