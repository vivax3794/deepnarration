export function limit_to_one<T>(func: () => Promise<T>): () => Promise<T> {
    let already_called: Promise<T> | null = null;
    return async () => {
        if (already_called !== null) {
            return await already_called;
        } else {
            already_called = func();
            let result = await already_called;
            already_called = null;
            return result;
        }
    }
}
