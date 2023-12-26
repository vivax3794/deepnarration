export default defineEventHandler(async (_event) => {
    let token = process.env.STABLE_TOKEN;

    return token !== undefined;
})
