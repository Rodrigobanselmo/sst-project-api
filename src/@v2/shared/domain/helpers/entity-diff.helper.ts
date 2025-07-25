export interface IObjectDiff {
  changes: Record<string, { old: any; new: any }>;
  hasChanges: boolean;
}

export interface CompareEntitiesOptions<T> {
  keysToCompare?: string[];
}

export function compareEntities<T extends Record<string, any>>(oldObj: T, newObj: T, options?: CompareEntitiesOptions<T>): IObjectDiff {
  const changes: Record<string, { old: any; new: any }> = {};
  let hasChanges = false;

  // Get keys to compare
  let keysToCheck: string[];

  if (options?.keysToCompare && options.keysToCompare.length > 0) {
    // Use only the specified keys
    keysToCheck = options.keysToCompare.map((key) => String(key));
  } else {
    // Get all unique keys from both objects (original behavior)
    keysToCheck = [...new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})])];
  }

  for (const key of keysToCheck) {
    const oldValue = oldObj?.[key];
    const newValue = newObj?.[key];

    // Skip functions, internal properties, and classes
    if (key.startsWith('_') || key === 'isNew' || key === 'originalEntity' || typeof oldValue === 'function' || typeof newValue === 'function') {
      continue;
    }

    // Compare values
    if (!isEqual(oldValue, newValue)) {
      changes[key] = { old: oldValue, new: newValue };
      hasChanges = true;
    }
  }

  return { changes, hasChanges };
}

function isEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a == null || b == null) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;

    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) return false;
      }
      return true;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!isEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
}
