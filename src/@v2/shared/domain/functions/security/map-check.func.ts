export function mapCheck<T>(mw: number, min: number, max: number, map: Record<number, T>) {
    let valueMap: T = {} as T;
    for (let index = 0; index < 100; index++) {
        const key = mw + index;
        if (key > max) {
            valueMap = map[max];

            break;
        }

        if (key < min) {
            valueMap = map[min];
            break;
        }

        const value = map[key];

        if (value) {
            valueMap = value;
            break;
        }
    }

    return valueMap;
}