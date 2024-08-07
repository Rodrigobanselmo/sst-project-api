
export class Aggregate {
    #data: Record<string, any> = {};

    async get<T>(func: () => Promise<T>) {
        if (!this.#data[func.toString()]) this.#data[func.toString()] = await func();
        return this.#data[func.toString()] as T;
    }
}
