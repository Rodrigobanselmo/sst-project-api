export function updateField<T, R>(oldValue: T, newValue: R) {
    if (newValue === undefined) return oldValue
    return newValue
}