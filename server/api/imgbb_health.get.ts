export default defineEventHandler(async (_event) => {
    let token = process.env.IMGBB_TOKEN;

    return token !== undefined;
})
